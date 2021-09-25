// eslint-disable-next-line import/no-self-import
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      accent: string;
      bgContent: string;
      secondaryAccent: string;
      background: string;
      fontBase: string;
    };
  }
}
