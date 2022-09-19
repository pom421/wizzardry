// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Go to next page": "NEXT";
    "Go to previous page": "PREVIOUS";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "Is not the first page": "PREVIOUS";
    "Is not the last page": "NEXT";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Creating new"
    | "Creating new.Showing page"
    | { "Creating new"?: "Showing page" };
  tags: never;
}
