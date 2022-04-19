# Monoprice 6 Zone Home Audio Multizone Controller and Amplifier Plugin

# Supported Commands

- Zone On/Off state (0x00 = OFF or 0x01 = ON)
- Source selected 1 - 6
- Volume level (00 - 38, Display Range 00 - 38)
- Bass level (0 = -10 ... 7 = Flat ... 14 = +10)
- Treble level (0 = -10 ... 7 = Flat ... 14 = +10)
- Balance level (00 = More Left ... 10 = Center ... 20 = More Right) \* No Keypad display for Balance
- Do Not Disturb state (00 = OFF, 01 = ON )
- Mute state (00 = OFF, 01 = ON )
- Keypad Connected Status (00 = NO, 01 = YES)

Note: The Zone must be ON or else commands for that zone will not be processed.

# SmartThings Capability Matrix

| HW Command  | ST Cap              | Serial Cmd |
| ----------- | ------------------- | ---------- |
| Zone On/Off | switch              | PR         |
| Source      | tvChannel           | CH         |
| Volume      | audioVolume         | VO         |
| Bass        | switchLevel         | BS         |
| Treble      | switchLevel         | TR         |
| Balance     | switchLevel         | BL         |
| DND         | switch              | DT         |
| Mute        | audioMute           | MU         |
| Keypad      | remoteControlStatus | LS         |

# Routes

- `/monoprice/controller/:controller/zone/:zone/capability/:capability`
  - `/monoprice/controller/:controller/zone/:zone/capability/switch`
  - `/monoprice/controller/:controller/zone/:zone/capability/switchLevel`
  - `/monoprice/controller/:controller/zone/:zone/capability/audioVolume`
  - `/monoprice/controller/:controller/zone/:zone/capability/audioMute`

POST to an endpoint will cause a command to be executed. The POST data must include:

```json
{
  "hw": "string",
  "capability": "string",
  "command": "string",
  "args": {
    "arg": "value"
  }
}
```

GET to an endpoint will cause a status response, the return body of which will include an array of attribute objects for each element in the zone that supports the requested capability:

```json
{
  "capability": "string",
  "attributes": [
    {
      "hw": "name",
      "attribute": "value"
    }
  ],
  "metadata": {
    "controller": "number",
    "zone": "number"
  }
}
```

# Options

When registering this plugin, options may be set. This plugin accepts the following options:

```yaml
monoprice:
  sources:
    - source_1_name
    - source_2_name
    - source_3_name
    - source_4_name
    - source_5_name
    - source_6_name
  controllers:
    - controller: 1
      zones:
        - zone: 1
          name: zone_1_name
        - zone: 2
          name: zone_2_name
        - zone: 3
          name: zone_3_name
        - zone: 4
          name: zone_4_name
        - zone: 5
          name: zone_5_name
        - zone: 6
          name: zone_6_name
  serial:
    device: /dev/usb0
    speed: 9600
```

- `controllers`: A list of controller configurations. Each entry on the list corresponds to 1 controller in the stack, starting with controller 1. The zones for each controller can be set in the `zones` list, where each entry is an object with `zone` and `name` attributes.
- `serial`: An object describing the serial interface on the host the plugin should use to communicate with the controller stack. The `device` attribute should be set to the full path of the serial device, and `speed` should reflect the baud rate at which communication may occur.

# Monoprice Serial Commands

Monoprice supports a default serial communication of 9600-N81. Flow control should be disabled.

The ready prompt is a `#`. Status commands start with `?`. Set commands start with `<`. Reply strings start with `>`.

A zone has to be powered on before it will accept commands.

Example: Power status of controller-1 zone-3?

```
#?13PR
#>13PR00
```

Example: Sources selected by all zones on conroller-1?

```
#?10CH
#>11CH06
#>12CH06
#>13CH06
#>14CH06
#>15CH01
#>16CH01
```

Example: All settings for controller-1 zone-2?

```
#?12
#>1200000000150710100601
```

Example: Turn controller-1 zone-4 on, then off

```
#?14PR
#>14PR00
#<14PR01
#?14PR
#>14PR01
#<14PR00
#?14PR
#>14PR00
```

## Serial Response Parser Regex

Single code inquiry

```
^#>(?<UNIT>\d)(?<ZONE>\d)(?<CMD>PP|PA|PR|MU|DT|VO|TR|BS|BL|CH|LS)(<?VAL>\d{2})$
```

Full zone inquiry

```
^#>(?<UNIT>\d)(?<ZONE>\d)(?<PA>\d{2})(?<PR>\d{2})(?<MU>\d{2})(?<DT>\d{2})(?<VO>\d{2})(?<TR>\d{2})(?<BS>\d{2})(?<BL>\d{2})(?<CH>\d{2})(?<LS>\d{2})$
```
