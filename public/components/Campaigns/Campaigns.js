import React, {Component, PropTypes} from 'react';
import CampaignList from '../CampaignList/CampaignList';

class Campaigns extends Component {

  static propTypes = {
    campaigns: PropTypes.array.isRequired,
  }

  filterCampaigns = (campaigns) => {
    var filtered = campaigns;

    var stateFilter = this.props.location.query.state || 'live';
    var typeFilter = this.props.location.query.type;

    if (stateFilter && stateFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === stateFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }
    return filtered;
  }

  sortBy = (field, reverse, iteratees) => {
    let key = function(x) {return iteratees ? iteratees(x[field]) : x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  prepareSortValues = (column, value) => {
    switch (column) {
      case 'name':
      case 'type':
      case 'status':
        if (typeof value === 'undefined') {
          value = "";
        }
        value.toUpperCase();
        break;
      case 'actualValue':
      case 'startDate':
        if (typeof value === 'undefined') {
          value = 0;
        }
        value = parseInt(value, 10);
      case 'endDate':
        if (typeof value === 'undefined') {
          value = Infinity;
        }
      default:
        value;
    }

    return value;
  }

  sortCampaigns = (campaigns) => {
    let sorted = campaigns;
    let column = this.props.campaignSortColumn;
    let order = this.props.campaignSortOrder || false;

    sorted = sorted.sort(this.sortBy(column, order, function(value) {
      return this.prepareSortValues(column, value);
    }.bind(this)));

    return sorted;
  }

  componentDidMount() {
    this.props.campaignActions.getCampaigns();
    this.props.analyticsActions.getOverallAnalyticsSummary();
  }

  render() {

    return (
      <div className="campaigns">
        <h2 className="campaigns__header">Campaigns</h2>
        <CampaignList campaigns={this.filterCampaigns(this.sortCampaigns(this.props.campaigns))} overallAnalyticsSummary={this.props.overallAnalyticsSummary} />
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getCampaigns from '../../actions/CampaignActions/getCampaigns';
import * as getOverallAnalyticsSummary from '../../actions/CampaignActions/getOverallAnalyticsSummary';

function mapStateToProps(state) {
  return {
    campaigns: state.campaigns,
    overallAnalyticsSummary: state.overallAnalyticsSummary,
    campaignSortColumn: state.campaignSort.campaignSortColumn,
    campaignSortOrder: state.campaignSort.campaignSortOrder
  };
}

function mapDispatchToProps(dispatch) {
  return {
    campaignActions: bindActionCreators(Object.assign({}, getCampaigns), dispatch),
    analyticsActions: bindActionCreators(Object.assign({}, getOverallAnalyticsSummary), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);
