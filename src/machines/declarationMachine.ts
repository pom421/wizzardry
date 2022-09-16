import { assign, createMachine } from "xstate";

type Declaration = { page1: any; page2: any }

export const declarationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTAYwDYEMBOmAuAlgPYB2AspqgBYElgB0AMkZhLVAAQoY77EkBiCKQa0AbkQDWDbllyFSFarQbNW7Lmjl9SCcUVQ6SAbQAMAXUSgADkVgEFJKyACeiAJwA2ADQgAHogAzIEALPSmngAckaYAjJEA7O7RAEyRAL7pvrK8jko0dEwsbCScOfL8AmDY2ETY9NZYeABmdQC29OVG+SpF6qWaPBW6+oaOZpZIILb2js4BCCmm9JGe7rEArO6hIZ4b8SGRvm6Lse70IbG7oaYblzGmGVkgXXmUBQwAylREAO4aYD8BFghFK9G+fw0zQI2BBHGsmBgHFoHGwAHoiBw2kQUAJqEQ7GBUWAxMD+BwQfgAK7wKYzBz8eaIFIpFbuBKxTkJOIpQ4hdzHRCxUws+gJFKBWKSzyBSKSjaeTLZLS5fg9QoQ-4DQHA0FQcE-LWcaGwvDwxFElHozHY3F0Px4Zz0uZTBaBXn0YXudnykIRSLuEKChCeeL0TymfleM7i90JJUvFXDcjvXqagFAkHsA2QgYIpEpZEkVEYrE4sACazYEnEGlOuwM0hMhDS8IywIi-YJBIhQIbYNRWL0QIJd1bR7bcUhBOvNWpwoAYWrfAGdF+OaNHBNcPzluLvzLuOEhX00k6Se684YS7AK84a43UJhO4tRY4B9tYD0JAkY34E3rWZGVdIUJWWQNVkeXtDhSWIfFcRANm5eh9ild0R22UxAhnC83mURdlz1DgH3TPNX0LFEP3LStq1JIg6zpBsXVABZNnFcMJUCdsYg2SINkCYNLlZDtIw5OJ1g5HChkvfDr0IjQSMNJ9TXNJErVLT8BHtR1GKApsQIQK4+LZWU-RlEIEn2ASEIQITh1MSNLliWDJQlRVnlnRQr3oG872IsB11I41nzNXc32tQ8K1tAhmhOGwmOAlihT9QIxU2S4QhCCVhSSQTnPs0ThTOWJJI83C51knz5NXALHwGbdQtfapamrCABD8Sk8AYTBmi67AAAoNgcgBKIRyq8yrfKIxTc2ClSwuaupIEAxsnAM4U0noQN3FgrKFSGzwgxs2DPGHXlIi9Q7TASGV3OVaS8I+egACUa3sbVMz1Oq5pfNT90ioQRHoU8ZHGlNKte0l3s4HUszBIKtxC1S93fSLv1-IwAN01bmx7MJ-V5MCpW2I6TmFGJPT9OUA0c253Ck7RHt6SGyQ+3VswRhrkbfKjcUW+pGnwVpsA6TzwaelnoY4WGvs5pGwsotHRkxiwVuY-xEK8C5AnZBJIl7TibuDYVgnDb0rm5W6LoZ1UJolt6M3Z+GlLIpFYnCjTqO0tXEo1hBdbFEINhSdxrosx4omN25UqiaIFSwvWkht5N1QYSXHbh-UEbC931Jtajotin39KShAA1S4OzguuV3F4krgy8DZtd2H1zv4u7Eweir7ahjPZZdn7GqRfnIHazrut66pBpGsau7t5mHbZzPvsR+ampqJaIGLtbS6DodRwjfYsM8dt2Sj021nWcOrdiZOZJ71mYc+jmB+5ij-s049RB-KRQbn8WF69yXv3Wab8eZKx-n+UgWN4p6R3n7Tk+wtqRBSFsEcEY9aRxspyKIYoRQ6yQncP0LI75M0KOnYBL9QFhXfqjTS-MGhNGFqLMGqcXqLyfk7LOr8aHgM-OjAwKtJiwJxutVBQ4tiBgjJhYOmUo6jjFKsUOSE5RxFuKQ7ugDH7S2fs7ah5E+HUSrDWeitIRHq1YrcSI4RNiymukkVYWVjacmWIkLiURRwBilBsDR89yEcJ0VwlevCR5tQ6ngfAE8+rT1MKNMWbCKGcOXtnAxoTt7NilB6R4Upuy3E7IcBusFwiHCQulNYh14wJhIOWMxndGaaMKGoEoZQwbpIMqYBuHd4neQRjLKhm4uYK2LBFT8bTS6hBQt2bsGx+KoKPgkAc+UIwSlHGcLY0Qnj3XqX4r4r8+l6M3LwvOkUxl+yykOe42xJToJuv2GyoZWTLPcSHQ6KDNl1NtgAjUezdFQFOZYyZUyZljnmdZE4dxlihipgbEOlkumsO8k0jQYtpYb1av8xAHTjoUwiA5Txwd+Kh3hf-NhU0FK1TlmvP6dDywYsMiyBIFwrjHy4ncBUCzsHenDFsSySxJTOXWb4r5clbzTQpTwgxitRnYwsUKQhw5LIWRSByWuMpgwsibpsNCmVg4MtQUK0l1V7zitAYM18xzpXmN9qxIa4FmWSmiJZPiHLwWHRQo8cUocpSXC2Aa7yZKaqBVfma4eaLloyutR4TY4YHhLADA8Apx0uVBw9Sbd0EQg5+smka-yvw6VeJjQ5ONyQHKJrJsq8MHJw63BuvEUcWaH5S32dw018tzUf1pRGkufs7iMqdTg9kQ0eyxAbo8Sm7JthpA5EsHxZUSXeUSYE5JEq3Ye3zigfNDkFVRC2LsEqodSZCjgo870N06ZymkQ2rRTbfkrxDUSNJXb4ELH4mES4DkdaNxjEcbBx6zbskPskLiph6Zzu2cK9hQCkkgMOZKjtG6n0ZKwhIu48Ro7KpDmCqNqUp2eG7MECdcQr3+Kg0umDGgQlhq3oh9amULmRkDCyQM7d4JkxcSsE+WwZnEz1tOMDnyEkBObXSrKfbgNH3cQRl1iAL2elDKha5oZ3TEbAHSgAtLydV+MuRoZSIdHa+HMiZCAA */
  createMachine(
    {
      context: {
        errorMessage: undefined as string | undefined,
        declaration: {} as Declaration,
        status: undefined as "creation" | "revision" | "consultation",
        mode: undefined as "write" | "readonly",
      },
      tsTypes: {} as import("./declarationMachine.typegen").Typegen0,
      schema: {
        services: {} as {
          loadDeclaration: {
            data: Declaration
          }
        },
        // events: {} as { type: "string" },
      },
      id: "declarationMachine",
      initial: "Loading declaration",
      states: {
        "Loading declaration": {
          invoke: {
            src: "loadDeclaration",
            onDone: [
              {
                cond: "Is existing declaration",
                target: "Showing existing",
              },
              {
                actions: "assignCreationStatus",
                target: "Creating new",
              },
            ],
            onError: [
              {
                target: "Loading declaration errored",
              },
            ],
          },
        },
        "Showing existing": {
          initial: "Showing first page in r/o mode",
          states: {
            "Showing first page in r/o mode": {
              on: {
                "choose revision status": {
                  target: "#declarationMachine.Revising existing",
                },
                next: {
                  target: "Showing page 2 in r/o mode",
                },
              },
            },
            "Showing page 2 in r/o mode": {
              on: {
                previous: {
                  target: "Showing first page in r/o mode",
                },
              },
            },
          },
        },
        "Loading declaration errored": {},
        "Creating new": {
          initial: "Showing first page in w mode",
          states: {
            "Showing first page in w mode": {
              invoke: {
                src: "submitPage1",
                onDone: [
                  {
                    cond: "validation is ok",
                    target: "Showing first page in r/o mode",
                  },
                  {
                    target: "Showing first page errored",
                  },
                ],
              },
            },
            "Showing page 2 in w mode": {
              on: {
                previous: {
                  target: "Showing first page in r/o mode",
                },
              },
            },
            "Showing first page in r/o mode": {
              on: {
                next: {
                  target: "Showing page 2 in w mode",
                },
                modify: {
                  target: "Showing first page in w mode",
                },
              },
            },
            "Showing first page errored": {
              after: {
                "500": {
                  target: "Showing first page in w mode",
                },
              },
            },
          },
        },
        "Revising existing": {
          initial: "Showing first page in w mode",
          states: {
            "Showing first page in w mode": {
              invoke: {
                src: "submitPage1",
                onDone: [
                  {
                    target: "Showing page 1 in r/o mode",
                  },
                ],
                onError: [
                  {
                    target: "Showing first page errored",
                  },
                ],
              },
            },
            "Showing page 1 in r/o mode": {
              on: {
                next: {
                  target: "Showing page 2 in w mode",
                },
                modify: {
                  target: "Showing first page in w mode",
                },
              },
            },
            "Showing first page errored": {
              after: {
                "500": {
                  target: "Showing first page in w mode",
                },
              },
            },
            "Showing page 2 in w mode": {
              invoke: {
                src: "submitPage2",
                onDone: [
                  {
                    target: "Showing page 1 in r/o mode",
                  },
                ],
                onError: [
                  {
                    target: "Showing page 2 errored",
                  },
                ],
              },
              on: {
                previous: {
                  target: "Showing page 1 in r/o mode",
                },
              },
            },
            "Showing page 2 errored": {
              after: {
                "500": {
                  target: "Showing page 2 in w mode",
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        assignCreationStatus: assign((context, event) => {
          return {
            status: "creation",
          }
        }),
      },
    },
  )
