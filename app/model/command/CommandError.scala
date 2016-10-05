package model.command

import play.api.mvc.{Results, Result}

case class CommandError(message: String, responseCode: Int) extends RuntimeException(message)

object CommandError extends Results {

  def CampaignTagNotFound = throw new CommandError("campaign tag not found", 400)


  def commandErrorAsResult: PartialFunction[Throwable, Result] = {
    case CommandError(msg, 400) => BadRequest(msg)
    case CommandError(msg, 404) => NotFound
  }
}
