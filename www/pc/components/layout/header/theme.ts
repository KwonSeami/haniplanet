import {staticUrl} from '../../../src/constants/env';
import {$FONT_COLOR, $WHITE, $POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';

interface IThemeType {
  white: any;
  black: any;
  [key: string]: any;
}

interface ITheme {
  fontColor: IThemeType;
  placeholdColor: IThemeType;
  borderColor: IThemeType;
  haniLogo: IThemeType;
  searchIcon: IThemeType;
  helpIcon: IThemeType;
  alarmIcon: IThemeType;
  cartIcon: IThemeType;
}

const theme: ITheme = {
  fontColor: { white: $WHITE, black: $FONT_COLOR },
  placeholdColor: { white: $WHITE, black: $POINT_BLUE },
  borderColor: { white: $WHITE, black: $BORDER_COLOR },
  haniLogo: {
    white: staticUrl('/static/images/logo/logo-white.png'),
    black: staticUrl('/static/images/logo/logo.png'),
  },
  searchIcon: {
    white: staticUrl('/static/images/icon/icon-search-white.png'),
    black: staticUrl('/static/images/icon/icon-search.png'),
  },
  helpIcon: {
    white: staticUrl('/static/images/icon/icon-help-white.png'),
    black: staticUrl('/static/images/icon/icon-help.png'),
  },
  alarmIcon: {
    white: staticUrl('/static/images/icon/icon-notice-white.png'),
    black: staticUrl('/static/images/icon/icon-notice.png'),
    on: staticUrl('/static/images/icon/icon-notice-on.png'),
  },
  cartIcon: {
    white: staticUrl('/static/images/icon/icon-cart-white.png'),
    black: staticUrl('/static/images/icon/icon-cart.png')
  }
};

export default theme;
