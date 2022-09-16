// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.declarationMachine.Creating new.Showing first page in w mode:invocation[0]": {
      type: "done.invoke.declarationMachine.Creating new.Showing first page in w mode:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.declarationMachine.Loading declaration:invocation[0]": {
      type: "done.invoke.declarationMachine.Loading declaration:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.declarationMachine.Revising existing.Showing first page in w mode:invocation[0]": {
      type: "error.platform.declarationMachine.Revising existing.Showing first page in w mode:invocation[0]";
      data: unknown;
    };
    "error.platform.declarationMachine.Revising existing.Showing page 2 in w mode:invocation[0]": {
      type: "error.platform.declarationMachine.Revising existing.Showing page 2 in w mode:invocation[0]";
      data: unknown;
    };
    "xstate.after(500)#declarationMachine.Creating new.Showing first page errored": {
      type: "xstate.after(500)#declarationMachine.Creating new.Showing first page errored";
    };
    "xstate.after(500)#declarationMachine.Revising existing.Showing first page errored": {
      type: "xstate.after(500)#declarationMachine.Revising existing.Showing first page errored";
    };
    "xstate.after(500)#declarationMachine.Revising existing.Showing page 2 errored": {
      type: "xstate.after(500)#declarationMachine.Revising existing.Showing page 2 errored";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadDeclaration: "done.invoke.declarationMachine.Loading declaration:invocation[0]";
    submitPage1:
      | "done.invoke.declarationMachine.Creating new.Showing first page in w mode:invocation[0]"
      | "done.invoke.declarationMachine.Revising existing.Showing first page in w mode:invocation[0]";
    submitPage2: "done.invoke.declarationMachine.Revising existing.Showing page 2 in w mode:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: "loadDeclaration" | "submitPage1" | "submitPage2";
    guards: "Is existing declaration" | "validation is ok";
    delays: never;
  };
  eventsCausingActions: {
    assignCreationStatus: "done.invoke.declarationMachine.Loading declaration:invocation[0]";
  };
  eventsCausingServices: {
    loadDeclaration: "xstate.init";
    submitPage1:
      | "choose revision status"
      | "done.invoke.declarationMachine.Loading declaration:invocation[0]"
      | "modify"
      | "xstate.after(500)#declarationMachine.Creating new.Showing first page errored"
      | "xstate.after(500)#declarationMachine.Revising existing.Showing first page errored";
    submitPage2:
      | "next"
      | "xstate.after(500)#declarationMachine.Revising existing.Showing page 2 errored";
  };
  eventsCausingGuards: {
    "Is existing declaration": "done.invoke.declarationMachine.Loading declaration:invocation[0]";
    "validation is ok": "done.invoke.declarationMachine.Creating new.Showing first page in w mode:invocation[0]";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Creating new"
    | "Creating new.Showing first page errored"
    | "Creating new.Showing first page in r/o mode"
    | "Creating new.Showing first page in w mode"
    | "Creating new.Showing page 2 in w mode"
    | "Loading declaration"
    | "Loading declaration errored"
    | "Revising existing"
    | "Revising existing.Showing first page errored"
    | "Revising existing.Showing first page in w mode"
    | "Revising existing.Showing page 1 in r/o mode"
    | "Revising existing.Showing page 2 errored"
    | "Revising existing.Showing page 2 in w mode"
    | "Showing existing"
    | "Showing existing.Showing first page in r/o mode"
    | "Showing existing.Showing page 2 in r/o mode"
    | {
        "Creating new"?:
          | "Showing first page errored"
          | "Showing first page in r/o mode"
          | "Showing first page in w mode"
          | "Showing page 2 in w mode";
        "Revising existing"?:
          | "Showing first page errored"
          | "Showing first page in w mode"
          | "Showing page 1 in r/o mode"
          | "Showing page 2 errored"
          | "Showing page 2 in w mode";
        "Showing existing"?:
          | "Showing first page in r/o mode"
          | "Showing page 2 in r/o mode";
      };
  tags: never;
}
