import React, {PropTypes} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from "recharts";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as getCampaignTrafficDriverStats from "../../../actions/CampaignActions/getCampaignTrafficDriverStats";

class CampaignTrafficDriverStatsChart extends React.Component {

  componentWillMount() {
    this.props.campaignTrafficDriverStatsActions.getCampaignTrafficDriverStats(this.props.campaign.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.campaign.id !== this.props.campaign.id) {
      this.props.campaignTrafficDriverStatsActions.getCampaignTrafficDriverStats(this.props.campaign.id);
    }
  }

  renderDriverGroupChart = (group) => {

    const data = group.dayStats.map((day) => {
      return (
      {
        date: day.date,
        impressions: day.stats.impressions,
        clicks: day.stats.clicks,
        ctr: Math.round(day.stats.ctr * 100) / 100
      }
      );
    });

    const anchorName = group.groupName.toLowerCase().split(' ').join('-') + '-drivers';

    const shortDateFormat = (date) => {
      return new Date(date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})
    };

    const longerDateFormat = (date) => {
      return new Date(date).toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit', month: 'short'})
    };

    const numFormat = (num) => {
      return num.toLocaleString();
    };

    const percentFormat = (num) => {
      return num.toLocaleString() + '%';
    };

    const containerWidth = '95%';
    const chartWidth = 600;
    const chartHeight = 200;
    const chartMargin = {top: 15, right: 10, left: 10, bottom: 0};
    const xPadding = {left: 20, right: 20};

    if (group.dayStats.length == 0) {
      return (
        <div key={group.groupName} className="analytics-chart--half-width">
          <a name={anchorName}/>
          <div className="campaign-box__header">{group.groupName}</div>
          <div className="campaign-box__body">
            <span className="campaign-assets__field__value">No data yet.</span>
          </div>
        </div>
      );
    }

    return (
      <div key={group.groupName} className="analytics-chart--half-width">
        <a name={anchorName}/>
        <div className="campaign-box__header">{group.groupName}</div>
        <div className="campaign-box__body">
          <p>Impressions</p>
          <ResponsiveContainer height={chartHeight} width={containerWidth}>
            <LineChart width={chartWidth} height={chartHeight} data={data} syncId={group.groupName}
                       margin={chartMargin}>
              <XAxis dataKey="date" tickFormatter={shortDateFormat} padding={xPadding}/>
              <YAxis tickFormatter={numFormat}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip labelFormatter={longerDateFormat} formatter={numFormat}/>
              <Line type="monotone" dataKey="impressions" stroke="#8884d8" fill="#8884d8"/>
            </LineChart>
          </ResponsiveContainer>
          <p>Clicks</p>
          <ResponsiveContainer height={chartHeight} width={containerWidth}>
            <LineChart width={chartWidth} height={chartHeight} data={data} syncId={group.groupName}
                       margin={chartMargin}>
              <XAxis dataKey="date" tickFormatter={shortDateFormat} padding={xPadding}/>
              <YAxis tickFormatter={numFormat}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip labelFormatter={longerDateFormat} formatter={numFormat}/>
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" fill="#82ca9d"/>
            </LineChart>
          </ResponsiveContainer>
          <p>CTR (%)</p>
          <ResponsiveContainer height={chartHeight} width={containerWidth}>
            <LineChart width={chartWidth} height={chartHeight} data={data} syncId={group.groupName}
                       margin={chartMargin}>
              <XAxis dataKey="date" tickFormatter={shortDateFormat} padding={xPadding}/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip labelFormatter={longerDateFormat} formatter={percentFormat}/>
              <Line type="monotone" dataKey="ctr" name="CTR" stroke="#993399" fill="#993399"/>
              <Brush dataKey="date" tickFormatter={shortDateFormat} startIndex={data.length - 7}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  render() {

    if (!this.props.campaignTrafficDriverStats) {
      return (
        <div className="analytics-chart--full-width">
          <div className="campaign-box__header">Traffic Driver Performance
            <span className="campaign-driver-list__link"><a href="#driver-summary">Back to summary</a></span>
          </div>
          <ProgressSpinner />
        </div>
      );
    }

    if (this.props.campaignTrafficDriverStats.length > 0) {
      return (
        <div className="analytics-chart--full-width">
          <div className="campaign-box__header">Traffic Driver Performance
            <span className="campaign-driver-list__link"><a href="#driver-summary">Back to summary</a></span>
          </div>
          {this.props.campaignTrafficDriverStats.map(this.renderDriverGroupChart)}
        </div>
      );
    }

    return (
      <div className="analytics-chart--full-width">
        <div className="campaign-box__header">Traffic Driver Performance
          <span className="campaign-driver-list__link"><a href="#driver-summary">Back to summary</a></span>
        </div>
        <span className="campaign-assets__field__value">No traffic driver data to show.</span>
      </div>
    );
  }
}

//REDUX CONNECTIONS

function mapStateToProps(state) {
  return {
    campaignTrafficDriverStats: state.campaignTrafficDriverStats
  };
}

function mapDispatchToProps(dispatch) {
  return {
    campaignTrafficDriverStatsActions: bindActionCreators(Object.assign({}, getCampaignTrafficDriverStats), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignTrafficDriverStatsChart);
