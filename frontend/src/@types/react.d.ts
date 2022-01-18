// eslint-disable-next-line import/no-self-import
import React from 'react';

interface ViewProps {
  verboseName: string;
  parentName?: string;
}

declare module 'react' {
  // View Component type with custom types
  export type ViewComponent<P = unknown> = React.FC<P & ViewProps>;
  export type VC<P = unknown> = ViewComponent<P>
}
