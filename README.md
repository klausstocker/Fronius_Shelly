# Fronius_Shelly
Script for Shelly Smart Plugs to switch load depending on available power with Fronius inverters.

This script can be used to switch loads with a shelly smart plug depending on the gird power of a fronius inverter without the need to send data to a cloud service.
All you need is a supported fronius inverter (eg.g Gen24 with a smart meter) connected to your local network. 

Installation instructions:
1) Find ip address of inverter and activate Solar-API (see Fronius Doku).
2) Connect Shelly smart plug to the network (see Shelly Doku).
3) Add a script and copy the content of the shelly_fronius.js file to the smart plug.
4) Edit constants on top of the script.

For testing it is recommended to turn debugging on and set the intervall_s to a lower value (10) to make debugging easier.

The script is tested with and without a battery connected to the inverter.
