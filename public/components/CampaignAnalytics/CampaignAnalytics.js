import React, {PropTypes} from "react";
import CampaignPerformanceSummary from "./Analytics/CampaignPerformanceSummary";
import CampaignDailyTrafficChart from "./Analytics/CampaignDailyTrafficChart";
import CampaignPagesCumulativeTrafficChart from "./Analytics/CampaignPagesCumulativeTrafficChart";
import ContentTrafficChart from "./Analytics/ContentTrafficChart";
import CampaignTrafficDriverStatsChart from "./Analytics/CampaignTrafficDriverStatsChart";

class CampaignAnalytics extends React.Component {

  isAnalysisAvailable(campaign) {
    const analysableStatus = campaign.status === 'live' || campaign.status === 'dead';
    return (analysableStatus && campaign.startDate && campaign.pathPrefix );
  }

  getLatestCounts() {
    if(this.props.campaignAnalytics) {
      return this.props.campaignAnalytics.pageCountStats[this.props.campaignAnalytics.pageCountStats.length - 1];
    }

    return undefined;
  }

  render () {
    if (!this.isAnalysisAvailable(this.props.campaign)) {
      return null;
    }

    if (!this.props.campaignAnalytics) {
      return <div className="campaign-info__body">Loading... </div>;
    }

    return (
      <div>
        <div className="campaign-info__body">

          <CampaignPerformanceSummary campaign={this.props.campaign} paths={this.props.campaignAnalytics.seenPaths}
                                      latestCounts={this.getLatestCounts()}/>
          <CampaignDailyTrafficChart pageCountStats={this.props.campaignAnalytics.pageCountStats}/>
          <CampaignPagesCumulativeTrafficChart pageCountStats={this.props.campaignAnalytics.pageCountStats}
                                               paths={this.props.campaignAnalytics.seenPaths}/>
          {this.props.campaignAnalytics.seenPaths.map((p) =>
            <ContentTrafficChart key={p} pageCountStats={this.props.campaignAnalytics.pageCountStats} path={p}/>
          )}
        </div>
        <div className="campaign-info__body">
          <CampaignTrafficDriverStatsChart campaign={this.props.campaign}/>
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return {
    campaignAnalytics: state.campaignAnalytics
  };
}

export default connect(mapStateToProps)(CampaignAnalytics);
