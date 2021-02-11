import * as React from 'react';
import SecurityDefense from './SecurityDefense';
import getWaterMarkCanvas from './WaterMarkCanvas';

const defaultOptions = {
  chunkWidth: 200,
  chunkHeight: 60,
  textAlign: 'left',
  textBaseline: 'bottom',
  globalAlpha: 0.17,
  font: '14px Microsoft Yahei',
  rotateAngle: -0.26,
  fillStyle: '#666',
};

const waterMarkStyle =
  'position: absolute;left: 0;right: 0;top:0;bottom:0;opacity: 0.7;z-index: 2 !important;pointer-events: none;overflow: hidden;background-color: transparent;background-repeat: repeat;';
const noop = function() {};

class WaterMark extends React.PureComponent {
  public canvasURL: string;
  constructor(props) {
    super(props);
    this.watermarkId = this.genRandomId('water-mark');
    this.watermarkWrapperId = this.genRandomId('water-mark-wrapper');
    this.security = null;
    this.DOMRemoveObserver = null;
    this.DOMAttrModifiedObserver = null;
    this.canvasURL = this.getCanvasUrl();
  }

  public encrypt = str => {
    return window.btoa(decodeURI(encodeURIComponent(str)));
  };

  public genRandomId = (prefix = '') => {
    return `${this.encrypt(prefix)}-${new Date().getTime()}-${Math.floor(Math.random() * Math.pow(10, 8))}`;
  };

  public componentDidMount() {
    const {openSecurityDefense, securityAlarm} = this.props;
    if (openSecurityDefense) {
      const style = {
        waterMarkStyle,
        getCanvasUrl: this.getCanvasUrl,
      };
      const securityHooks = {
        securityAlarm,
        updateObserver: this.updateObserver,
      };
      const watermarkDOM = {
        watermarkId: this.watermarkId,
        watermarkWrapperId: this.watermarkWrapperId,
        genRandomId: this.genRandomId,
      };
      this.security = new SecurityDefense(watermarkDOM, style, securityHooks);
    }
  }

  public componentWillUnmount() {
    if (this.props.openSecurityDefense) {
      if (this.DOMRemoveObserver) {
        this.DOMRemoveObserver.disconnect();
      }
      if (this.DOMAttrModifiedObserver) {
        this.DOMAttrModifiedObserver.disconnect();
      }
      this.security = null;
    }
  }

  public updateObserver = (observers = {}) => {
    if (observers.DOMRemoveObserver) {
      this.DOMRemoveObserver = observers.DOMRemoveObserver;
    }
    if (observers.DOMAttrModifiedObserver) {
      this.DOMAttrModifiedObserver = observers.DOMAttrModifiedObserver;
    }
  };

  public getCanvasUrl = () => {
    const {waterMarkText, options} = this.props;
    const newOptions = Object.assign({}, defaultOptions, options);
    return getWaterMarkCanvas(waterMarkText, newOptions);
  };

  public render() {
    const {children} = this.props;
    const styles = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      opacity: 0.7,
      zIndex: 2,
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundImage: `url("${this.canvasURL}")`,
      backgroundColor: 'transparent',
      backgroundRepeat: 'repeat',
    };

    return (
      <div
        style={{
          position: 'relative',
        }}
        id={this.watermarkWrapperId}
      >
        <div
          style={styles}
          id={this.watermarkId}
        />
        {children}
      </div>
    );
  }
}

WaterMark.defaultProps = {
  openSecurityDefense: false,
  securityAlarm: noop,
  options: defaultOptions,
};

export default WaterMark;