package repositories

import model.{Campaign, CampaignWithSubItems, Note}
import org.joda.time.DateTime
import play.api.Logger
import services.Dynamo

import scala.collection.JavaConversions._

object CampaignRepository {

  def getCampaign(campaignId: String) = {
    Option(Dynamo.campaignTable.getItem("id", campaignId)).map{ Campaign.fromItem }
  }

  def getCampaignWithSubItems(campaignId: String) = {
    val campaign = Option(Dynamo.campaignTable.getItem("id", campaignId)).map{ Campaign.fromItem }

    campaign map { c =>
      CampaignWithSubItems(
        campaign = c,
        content = CampaignContentRepository.getContentForCampaign(c.id),
        notes = CampaignNotesRepository.getNotesForCampaign(c.id)
      )
    }
  }

  def putCampaign(campaign: Campaign) = {
    try {
      Dynamo.campaignTable.putItem(campaign.toItem)
      Some(campaign)
    } catch {
      case e: Error => {
        Logger.error(s"failed to persist campaign $campaign", e)
        None
      }
    }
  }

}
