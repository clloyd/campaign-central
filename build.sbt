addCommandAlias("dist", ";riffRaffArtifact")

import play.sbt.PlayImport.PlayKeys._

name := "campaign-central"

version := "1.0"

resolvers += "Guardian Bintray" at "https://dl.bintray.com/guardian/editorial-tools"

lazy val dependencies = Seq(
  "com.amazonaws" % "aws-java-sdk" % "1.11.8",
  "ai.x" %% "play-json-extensions" % "0.8.0",
  "com.gu" % "pan-domain-auth-play_2-5_2.11" % "0.4.0",
  "com.google.apis" % "google-api-services-analyticsreporting" % "v4-rev10-1.22.0",
  ws
)

lazy val root = (project in file(".")).enablePlugins(PlayScala, SbtWeb, RiffRaffArtifact)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    playDefaultPort := 2267,
    packageName in Universal := normalizedName.value,
    name in Universal := normalizedName.value,
    topLevelDirectory in Universal := Some(normalizedName.value),
    riffRaffPackageType := (packageZipTarball in config("universal")).value,
    riffRaffBuildIdentifier := Option(System.getenv("CIRCLE_BUILD_NUM")).getOrElse("DEV"),
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffPackageName := s"commercial-tools:${name.value}",
    riffRaffManifestProjectName := riffRaffPackageName.value,
    riffRaffArtifactResources := Seq(
      riffRaffPackageType.value -> s"packages/${name.value}/${riffRaffPackageType.value.getName}",
      baseDirectory.value / "deploy.json" -> "deploy.json"
    ),
    scalaVersion := "2.11.8",
    scalaVersion in ThisBuild := "2.11.8",
    libraryDependencies ++= dependencies
  )
