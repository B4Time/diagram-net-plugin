# diagram-net-plugin
Drawio/Diagram.net Javascript Plug-in that allows the creation of B4Time models. B4Time models will be processed by the B4Time-Sim application (coming soon).

## Draw.io / Diagram.net Plugin to Draw B4Time models
This plugin works with the desktop version of draw.io/diagram.net. It hasn't been tried on the web version and as the export uses electron specific dialog, fs and other calls it will need some rework to work on the web.

## Dependency: Install Draw.io/Diagram.net desktop application
The B4Time Plugin will only work in the Draw.io and/or Diagram.net diagraming applications and only in the desktop versions.  
Installation releases and instructions can be found here.
[Drawio-desktop-releases](https://github.com/jgraph/drawio-desktop/releases)

## Download the B4Time Plugin
To get plugin (move it to your computer) you have two choices:
1. Clone this repo.
2. Save just the src/b4time.js file to somewhere on your machine.

## Install the B4Time Plugin
With the draw.io/diagram.net installed, first open the draw.io/diagram.net application.

<img src="/assets/01_Extra_Plugin.png?raw=true" alt="drawing" width="500"/>

In the image above find the Menu Extra->Plugins. 

<img src="/assets/02_No_Plugin.png?raw=true" alt="drawing" width="500"/>

Above, press the "Add" button 

<img src="/assets/02a_External_Select_File.png?raw=true" alt="drawing" width="500"/>

Above, press the "Select File" button 

<img src="/assets/03_Select_B4time_js.png?raw=true" alt="drawing" width="500"/>

Above, find the Plugin b4time.js and select it.

<img src="/assets/04_Need_to_restart.png?raw=true" alt="drawing" width="500"/>

Above, once you hit apply you will be prompted to quit drawio/diagram.net for the changes to take effect.

<img src="/assets/05_quit.png?raw=true" alt="drawing" width="500"/>

Above, you really need to quit.  Closing won't be enough.

<img src="/assets/06_Restarted.png?raw=true" alt="drawing" width="500"/>

Above, restart and you should see two new features. First, on the left there should be a new pallet of B4Time components. Second, on the menu bar you should now see a B4Time menu item.

<img src="/assets/07_B4Time_Menu.png?raw=true" alt="drawing" width="500"/>

Above, if you select the B4Time menu it should look something like this.

<img src="/assets/08_With_Diagram.png?raw=true" alt="drawing" width="500"/>

Above, next you can start to layout your B4Time model using the items in the pallet.  Here is an example. The "GPU" and "Processor Theta" are of type "processor. The "Memory" and "Memory Theta" are of type "memory". The "Data*" elements are all of type "data". And, the "Task*" elements are all of type "task".

The links or edges between these components are of two types "link" and "binding".  You can use the edges from the B4Time pallet or just use the edges as you normally would and the plugin will do a bunch of checking warning you of connections that won't work and probably ask you to add some labels (Ice Cream, Beef, etc).

The Model Checking command can be found in the B4Time menu drop down.  The Export Model will also do model checking.

The exported model will be saved into a *.b4tjson file which be consumed later by the B4Time simulator.

Later we will talk about how to use these elements to model a compute system that you are interested in exploring.

## Note about Draw.io and Diagram.net Plug-ins.
There are few fully featured plug-ins out there. For this plugin we took inspiration and code from many other places. As it stands it could easily be used as a base for other plugins as well. So, if you are thinking of creating a plugin of your own. Please take a look at the code and we hope it inspires you to create.


