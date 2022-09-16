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
    "Decrement step": "previous";
    "Increment step": "next";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "Is not the first page": "previous";
    "Is not the last page": "next";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Creating new"
    | "Creating new.Showing page"
    | { "Creating new"?: "Showing page" };
  tags: never;
}
