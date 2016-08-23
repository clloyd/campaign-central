import React, { PropTypes } from 'react';
import CampaignInformationEdit from '../CampaignInformationEdit/CampaignInformationEdit';
import CampaignPerformanceMetrics from '../CampaignPerformanceMetrics/CampaignPerformanceMetrics';

class Campaign extends React.Component {

  componentWillMount() {
    this.props.campaignActions.getCampaign(this.props.params.id);
  }

  render () {
    if (!this.props.campaign) {
      return <div>Loading... </div>;
    }

    return (
      <div className="campaign">
        <h2>{this.props.campaign.name}</h2>
        <div className="campaign__row">
          <div className="campaign__column">
            <CampaignInformationEdit campaign={this.props.campaign} updateCampaign={this.props.campaignActions.updateCampaign} saveCampaign={this.props.campaignActions.saveCampaign}/>
          </div>
          <div className="campaign__column--double-width">
            <CampaignPerformanceMetrics campaign={this.props.campaign} />
          </div>
        </div>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getCampaign from '../../actions/CampaignActions/getCampaign';
import * as updateCampaign from '../../actions/CampaignActions/updateCampaign';
import * as saveCampaign from '../../actions/CampaignActions/saveCampaign';

function mapStateToProps(state) {
  return {
    campaign: state.campaign
  };
}

function mapDispatchToProps(dispatch) {
  return {
    campaignActions: bindActionCreators(Object.assign({}, getCampaign, updateCampaign, saveCampaign), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
