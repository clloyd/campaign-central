import React, {PropTypes} from "react";
import ProgressSpinner from "../utils/ProgressSpinner";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class CampaignTrafficDrivers extends React.Component {

  renderLineItemLink = (url) => {
    return (
      <a key={url} href={url} target="_blank" title="DFP line item">
        <i className="i-dfp"/>
      </a>
    );
  };

  renderTrafficDriverGroup = (group) => {

    const dateFormat = (date) => {
      return new Date(date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})
    };

    const href = '#' + group.groupName.toLowerCase().split(' ').join('-') + '-drivers';

    return (
      <div key={group.groupName} className="campaign-driver-list__item">
        <div className="campaign-driver-list__row">
          <div className="campaign-driver-list__type">{group.groupName}</div>
          <div className="campaign-driver-list__date">{dateFormat(group.startDate)}</div>
          <div className="campaign-driver-list__date">{dateFormat(group.endDate)}</div>
          <div className="campaign-driver-list__stat">
            <a href={href}>{group.summaryStats.impressions.toLocaleString()}</a>
          </div>
          <div className="campaign-driver-list__stat">
            <a href={href}>{group.summaryStats.clicks.toLocaleString()}</a>
          </div>
          <div className="campaign-driver-list__stat">
            <a href={href}>{group.summaryStats.ctr.toFixed(2)}%</a>
          </div>
          <div className="campaign-driver-list__links">{group.trafficDriverUrls.map( this.renderLineItemLink )}</div>
        </div>
      </div>
    );
  };

  render() {

    if(!this.props.campaignTrafficDrivers) {
      return (<ProgressSpinner />);
    }

    if(this.props.campaignTrafficDrivers.length > 0) {
      return (
        <div className="campaign-driver-list campaign-assets__field__value">
          <div className="campaign-driver-list__row">
            <div className="campaign-driver-list__type--header">Type</div>
            <div className="campaign-driver-list__date--header">Start</div>
            <div className="campaign-driver-list__date--header">End</div>
            <div className="campaign-driver-list__stat--header">Impressions</div>
            <div className="campaign-driver-list__stat--header">Clicks</div>
            <div className="campaign-driver-list__stat--header">CTR</div>
            <div className="campaign-driver-list__links--header">Line items</div>
          </div>
          {this.props.campaignTrafficDrivers.map( this.renderTrafficDriverGroup ) }
        </div>
      );
    }

    return (
      <span className="campaign-assets__field__value">There are currently no traffic drivers linked to this campaign.</span>
    )
  };
}

export default CampaignTrafficDrivers;
