package services

import java.util.Properties
import com.amazonaws.services.s3.model.GetObjectRequest
import services.Config._
import scala.collection.JavaConversions._

object Config extends AwsInstanceTags {

  lazy val conf = readTag("Stage") match {
    case Some("PROD") =>    new ProdConfig
    case Some("CODE") =>    new CodeConfig
    case _ =>               new DevConfig
  }

  def apply() = {
    conf
  }
}

sealed trait Config {
  def stage: String

  def pandaDomain: String
  def pandaAuthCallback: String

  def campaignTableName = s"campaign-central-$stage-campaigns"
  def campaignNotesTableName = s"campaign-central-$stage-campaign-notes"
  def campaignContentTableName = s"campaign-central-$stage-campaign-content"

  // remote configuration is used for things we don't want to check in to version control
  // such as passwords, private urls, and gossip about other teams
  private val remoteConfiguration: Map[String, String] = loadRemoteConfiguration



  private def getRequiredRemoteStringProperty(key: String): String = {
    remoteConfiguration.getOrElse(key, {
      throw new IllegalArgumentException(s"Property '$key' not configured")
    })
  }

  private def loadRemoteConfiguration = {

    val stack = readTag("Stack") getOrElse "flexible"
    val stage = readTag("Stage") getOrElse "DEV"
    val app = readTag("App") getOrElse "tag-manager"

    val bucketName = s"guconf-${stack}"

    def loadPropertiesFromS3(propertiesKey: String, props: Properties): Unit = {
      val s3Properties = AWS.S3Client.getObject(new GetObjectRequest(bucketName, propertiesKey))
      val propertyInputStream = s3Properties.getObjectContent
      try {
        props.load(propertyInputStream)
      } finally {
        try {propertyInputStream.close()} catch {case _: Throwable => /*ignore*/}
      }
    }

    val props = new Properties()

    loadPropertiesFromS3(s"$app/global.properties", props)
    loadPropertiesFromS3(s"$app/$stage.properties", props)

    props.toMap
  }
}

class DevConfig extends Config {
  override def stage = "DEV"

  override def pandaDomain: String = "local.dev-gutools.co.uk"
  override def pandaAuthCallback: String = "https://campaign-central.local.dev-gutools.co.uk/oauthCallback"
}

class CodeConfig extends Config {
  override def stage = "CODE"

  override def pandaDomain: String = "code.dev-gutools.co.uk"
  override def pandaAuthCallback: String = "https://campaign-central.code.dev-gutools.co.uk/oauthCallback"
}

class ProdConfig extends Config {
  override def stage = "PROD"

  override def pandaDomain: String = "gutools.co.uk"
  override def pandaAuthCallback: String = "https://campaign-central.gutools.co.uk/oauthCallback"
}