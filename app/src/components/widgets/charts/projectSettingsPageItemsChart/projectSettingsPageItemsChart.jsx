import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { activeProjectSelector } from 'controllers/user';
import { redirect } from 'redux-first-router';
import { defectLinkSelector, statisticsLinkSelector } from 'controllers/testItem';
import * as COLORS from 'common/constants/colors';
import { STATS_PASSED } from 'common/constants/statistics';
import { C3Chart } from '../common/c3chart';

const NOT_PASSED_STATISTICS_KEY = 'statistics$executions$notPassed';

@connect(
  (state) => ({
    project: activeProjectSelector(state),
    getDefectLink: (params) => defectLinkSelector(state, params),
    getStatisticsLink: (name) => statisticsLinkSelector(state, { statuses: [name] }),
  }),
  {
    redirect,
  },
)
@injectIntl
export class ProjectSettingsPageItemsChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    redirect: PropTypes.func.isRequired,
    widget: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
    height: PropTypes.number,
    project: PropTypes.string.isRequired,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isPreview: false,
    height: 0,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    // this.props.observer.subscribe('widgetResized', this.resizeChart);
    this.getConfig();
  }

  componentWillUnmount() {
    // this.node.removeEventListener('mousemove', this.setupCoords);
    // this.props.observer.unsubscribe('widgetResized', this.resizeChart);
  }
  /*
  onChartCreated = (chart, element) => {
    this.chart = chart;
    this.node = element;

    if (!this.props.widget.content.result || this.props.isPreview) {
      d3.selectAll('.c3-chart-texts text, .c3-chart-arc text').each(() => {
        d3.select(this).remove();
      });
      return;
    }

    this.node.addEventListener('mousemove', this.setupCoords);

    if (!this.props.isPreview) {
      this.resizeHelper(this.node);
    }
  }; */

  onMouseOut = () => {
    this.chart.revert();
  };

  onMouseOver = (id) => {
    this.chart.focus(id);
  };

  getProcessedData = (data) => {
    const columns = data.map((colData) => [colData.color, 1]);
    const itemNames = data.map((colData) => colData.longName);
    const colors = data.map((colData) => {
      const o = {};
      o[colData.longName] = colData.color;
      return o;
    });

    const chartData = {
      columns,
      groups: [itemNames],
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
      itemNames,
      donut,
      axis,
    };
  };

  getConfig = () => {
    const { widget } = this.props;
    const colors = {};
    colors[STATS_PASSED] = COLORS.COLOR_PASSED;
    colors[NOT_PASSED_STATISTICS_KEY] = COLORS.COLOR_NOTPASSED;

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

  /*  resizeHelper = () => {
    // eslint-disable-next-line func-names
    d3.selectAll('.barMode .c3-chart-texts text').each(function(d) {
      const barBox = d3
        .selectAll(`.barMode .c3-target-${d.id}`)
        .node()
        .getBBox();
      const textBox = d3
        .select(this)
        .node()
        .getBBox();
      let x = barBox.x + barBox.width / 2 - textBox.width / 2;
      if (d.id === STATS_PASSED && x < 5) x = 5;
      if (d.id === NOT_PASSED_STATISTICS_KEY && x + textBox.width > barBox.x + barBox.width)
        x = barBox.x + barBox.width - textBox.width - 5;
      d3.select(this).attr('x', x);
    });
    // eslint-disable-next-line func-names
    d3.selectAll('.pieChartMode .c3-chart-arc text').each(function() {
      const elem = d3.select(this);
      (elem.datum().endAngle - elem.datum().startAngle) / 2 + elem.datum().startAngle > Math.PI
        ? elem.attr('dx', 10)
        : elem.attr('dx', -10);
    });
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
  }; */

  render() {
    /*
    const customBlock = (
      <div className={cx('launch-info-block')}>
        { } <span className={cx('launch-name-title')}>
          {this.props.intl.formatMessage(messages.launchName)}
        </span> }
        <span className={cx('launch-name')}>{this.props.widget.name}</span>
      </div>
    );
*/
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
