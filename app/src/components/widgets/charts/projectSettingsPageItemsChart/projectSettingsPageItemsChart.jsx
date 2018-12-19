import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { activeProjectSelector } from 'controllers/user';
import { redirect } from 'redux-first-router';
import { C3Chart } from '../common/c3chart';

@connect(
  (state) => ({
    project: activeProjectSelector(state),
  }),
  {
    redirect,
  },
)
export class ProjectSettingsPageItemsChart extends Component {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    project: PropTypes.string.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    this.props.observer.subscribe('widgetResized', this.resizeChart);
    this.getConfig();
  }

  componentWillUnmount() {
    this.node.removeEventListener('mousemove', this.setupCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeChart);
  }

  onMouseOut = () => {
    this.chart.revert();
  };

  onMouseOver = (id) => {
    this.chart.focus(id);
  };

  getProcessedData = (data) => {
    const columns = data.map((colData) => [colData.color, 1]);
    const colors = data.map((colData) => {
      const o = {};
      o[colData.longName] = colData.color;
      return o;
    });

    const chartData = {
      columns,
      type: 'donut',
      onclick: () => {},
      order: null,
      colors,
      labels: {
        show: false,
      },
    };
    const donut = {
      label: {
        show: false,
      },
      width: 12,
    };

    const axis = {};

    return {
      chartData,
      donut,
      axis,
    };
  };

  getConfig = () => {
    const { widget } = this.props;

    const processedData = this.getProcessedData(widget);
    this.height = 52;
    this.width = 56;

    this.config = {
      data: processedData.chartData,
      axis: processedData.axis,
      padding: processedData.padding,
      legend: {
        show: false,
      },
      donut: processedData.donut,
      size: {
        height: this.height,
        width: this.width,
      },
      tooltip: {
        show: false,
      },
    };

    this.setState({
      isConfigReady: true,
    });
  };

  setupCoords = ({ pageX, pageY }) => {
    this.x = pageX;
    this.y = pageY;
  };

  resizeChart = () => {
    const newHeight = this.props.container.offsetHeight;
    const newWidth = this.props.container.offsetWidth;
    if (this.height !== newHeight) {
      this.chart.resize({
        height: newHeight,
      });
      this.height = newHeight;
    } else if (this.width !== newWidth) {
      this.chart.flush();
      this.width = newWidth;
    }
    this.resizeHelper(this.node);
  };

  render() {
    return (
      this.state.isConfigReady && (
        <C3Chart
          config={this.config}
          onChartCreated={this.onChartCreated}
          className={'donutChartMode'}
        />
      )
    );
  }
}
