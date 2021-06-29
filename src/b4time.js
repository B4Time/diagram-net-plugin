const fs = require('fs')
const os = require('os');
const path = require('path')
const url = require('url')
/**
 * Simulator Plug-in
 */
Draw.loadPlugin(function(ui) {
    var sidebar_title = "B4Time";
    var sidebar_id = "b4time";
    var b4time = {};
    b4time.VERSION = '1.0';

    var highlight = new mxCellHighlight(graph, '#00ff00', 8);


    function make_shape(value) {
        // label="Processor n" type="processor" speed="100"
        var doc = mxUtils.createXmlDocument();
        var obj = value;
        if(value == 'processor'){
            obj = doc.createElement('Processor');
            obj.setAttribute('label', 'Processor');
            obj.setAttribute('type', 'processor');
            obj.setAttribute('speed', '100');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'processor');
            // obj.appendChild(extras);
        }
        if(value == 'memory'){
            obj = doc.createElement('Memory');
            obj.setAttribute('label', 'Memory');
            obj.setAttribute('type', 'memory');
            obj.setAttribute('size', '10000');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'memory');
            // obj.appendChild(extras);
        }
        if(value == 'task'){
            obj = doc.createElement('Task');
            obj.setAttribute('label', 'Task');
            obj.setAttribute('type', 'task');
            obj.setAttribute('task_name', 'N/A');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'task');
            // obj.appendChild(extras);
        }
        if(value == 'data'){
            obj = doc.createElement('Data');
            obj.setAttribute('label', 'Data');
            obj.setAttribute('type', 'data');
            obj.setAttribute('current_size', '0');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'data');
            // obj.appendChild(extras);
        }
        if(value == 'link'){
            obj = doc.createElement('Link');
            obj.setAttribute('label', 'Link');
            obj.setAttribute('type', 'link');
            obj.setAttribute('speed', '10000');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'link');
            // obj.appendChild(extras);
        }
        if(value == 'binding'){
            obj = doc.createElement('Binding');
            obj.setAttribute('label', 'Binding');
            obj.setAttribute('type', 'binding');
            // extras=doc.createElement('Extras');
            // extras.setAttribute('type', 'binding');
            // obj.appendChild(extras);
        }
        return(obj);
    }

    // Create a custom side bar with b4time simulator models predefined
	// Sidebar is null in lightbox
	if (ui.sidebar != null)
	{
	    // Adds custom sidebar entry
	    ui.sidebar.addPalette(sidebar_id, sidebar_title, true, function(content) {
            //Sidebar.prototype.createVertexTemplate = function(style, width, height, value, title, showLabel, showTitle, allowCellsInserted, showTooltip)
            content.appendChild(ui.sidebar.createVertexTemplate('rounded=0;whiteSpace=wrap;html=1;',120,60, make_shape('processor'), "Processor"));
            content.appendChild(ui.sidebar.createVertexTemplate('rounded=0;whiteSpace=wrap;html=1;',120,60, make_shape('memory'), "Memory"));
            content.appendChild(ui.sidebar.createVertexTemplate('rounded=1;whiteSpace=wrap;html=1;',120,60, make_shape('task'), "Task"));
            content.appendChild(ui.sidebar.createVertexTemplate('rounded=1;whiteSpace=wrap;html=1;',120,60, make_shape('data'), "Data"));

            //Sidebar.prototype.createEdgeTemplate = function(style, width, height, value, title, showLabel, allowCellsInserted, showTooltip)
            content.appendChild(ui.sidebar.createEdgeTemplate('edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;', 60, 60, make_shape('link'), "Link"));
            content.appendChild(ui.sidebar.createEdgeTemplate('edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;', 60, 60, make_shape('binding'), "Binding"));
	    });
	
	    // Collapses default sidebar entry and inserts this before
	    var c = ui.sidebar.container;
	    c.firstChild.click();
	    c.insertBefore(c.lastChild, c.firstChild);
	    c.insertBefore(c.lastChild, c.firstChild);
	
	    // Adds logo to footer
	    //ui.footerContainer.innerHTML = '<img width=50px height=17px align="right" style="margin-top:14px;margin-right:12px;" ' + 'src="http://download.esolia.net.s3.amazonaws.com/img/eSolia-Logo-Color.svg"/>';
		
		// Adds placeholder for %today% and %filename%
	    var graph = ui.editor.graph;
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'today')
			{
				return new Date().toLocaleString();
			}
			else if (name == 'filename')
			{
				var file = ui.getCurrentFile();
				
				return (file != null && file.getTitle() != null) ? file.getTitle() : '';
			}
			
			return graphGetGlobalVariable.apply(this, arguments);
		};
		
		// Adds support for exporting PDF with placeholders
		var graphGetExportVariables = graph.getExportVariables;
		
		Graph.prototype.getExportVariables = function()
		{
			var vars = graphGetExportVariables.apply(this, arguments);
			var file = ui.getCurrentFile();
			
			vars['today'] = new Date().toLocaleString();
			vars['filename'] = (file != null && file.getTitle() != null) ? file.getTitle() : '';
			
			return vars;
		};
	
        // Comment here and below
	    // Adds resource for action
        mxResources.parse('checkModelAction=Check Model');
	    mxResources.parse('runSimulationAction=Run Simulation');
	    mxResources.parse('showLog=Show Log');
	    mxResources.parse('exportB4TimeModel=Export Model');
	    mxResources.parse('aboutB4Time=About B4Time');
        
	    
	    // Adds action Check Model
	    ui.actions.addAction('checkModelAction', function() {
            check_diagram(graph);
	    });

	    // Adds action Run Simulation
	    ui.actions.addAction('runSimulationAction', function() {
	        var ran = Math.floor((Math.random() * 100) + 1);
	        mxUtils.alert('Simulation ran and the result is ' + ran);
	    });

	    // Adds action Show Log
	    ui.actions.addAction('showLog', function() {
            mxLog.debug("Show Log");
            mxLog.show();
	    });

        // Adds action Exp1
	    ui.actions.addAction('exportB4TimeModel', function() {
            saveB4TimeFileDialog(); // Calls out to platform legit file dialog
            //create_json(graph);
	    });

        // Adds action About B4Time
        ui.actions.addAction('aboutB4Time', function() {
            ui.showDialog(new AboutB4TimeDialog(ui).container, 320, 280, true, true);
        });


	    // Adds menu
	    ui.menubar.addMenu('B4Time', function(menu, parent) {
	        ui.menus.addMenuItem(menu, 'checkModelAction');
            //ui.menus.addMenuItem(menu, 'runSimulationAction');
            ui.menus.addMenuItem(menu, 'showLog');
            ui.menus.addMenuItem(menu, 'exportB4TimeModel');
            ui.menus.addMenuItem(menu, 'aboutB4Time');
	    });
	
	    // Reorders menubar
	    ui.menubar.container.insertBefore(ui.menubar.container.lastChild,
	        ui.menubar.container.lastChild.previousSibling.previousSibling);
	
	    // Adds toolbar button
	    ui.toolbar.addSeparator();
	    var elt = ui.toolbar.addItem('', 'checkModelAction');
	
	    // Cannot use built-in sprites
	    elt.firstChild.style.backgroundImage = 'url(https://www.draw.io/images/logo-small.gif)';
	    elt.firstChild.style.backgroundPosition = '2px 3px';

	}

/* **************************************************************************************
    B4Time Logic
    Functions of this section:
    * Check model (and repair if possible)
    * Eventually output the model in JSON format acceptable to the B4Time modeling backend
    * Maybe even run the simulator
***************************************************************************************** */

    function convertEdge2Link(cell) {
        // When you have an edge but it isn't a "Link" this will convert it
        var value = graph.getModel().getValue(cell);
    
        // Already an XML Node
        if (mxUtils.isNode(value))
        {
            // Already an XML Node
            if (!cell.hasAttribute('label')) {
                cell.setAttribute('label', 'CHANGE_THIS_LABEL');
            }
            if (!cell.hasAttribute('type')) {
                cell.setAttribute('type', 'link');
            }
            if (!cell.hasAttribute('speed')) {
                cell.setAttribute('speed', '10000');
            }
        }
        else {
            // Not an XML Node convert
            var doc = mxUtils.createXmlDocument();
            var parent_obj = doc.createElement('Link');
            parent_obj.setAttribute('label', value || 'CHANGE_THIS_LABEL');
            parent_obj.setAttribute('type', 'link');
            parent_obj.setAttribute('speed', '10000');
            graph.getModel().setValue(cell, parent_obj);
        }

        graph.refresh();
        return cell;
    }

    function convertEdge2Binding(cell) {
        // When you have an edge but it isn't a "Link" this will convert it
        var value = graph.getModel().getValue(cell);
    
        // Already an XML Node
        if (mxUtils.isNode(value))
        {
            // Already an XML Node
            if (!cell.hasAttribute('type')) {
                cell.setAttribute('type', 'binding');
            }
        }
        else {
            // Not an XML Node convert
            var doc = mxUtils.createXmlDocument();
            var parent_obj = doc.createElement('Binding');
            parent_obj.setAttribute('label', value || '');
            parent_obj.setAttribute('type', 'binding');
            graph.getModel().setValue(cell, parent_obj);
        }

        graph.refresh();
        return cell;
    }


    function get_other_end(orig_cell, edge, get_cell=false) {
        var edge_id = edge.getId();
        var source_id = orig_cell.getId();
        var source_label = orig_cell.getAttribute('label');
        var source_type = orig_cell.getAttribute('type');
        //mxUtils.alert("Info: Found edge off of task " + edge_id);
        var trg_cell = edge.getTerminal();
        var src_cell = edge.getTerminal(true);
        if (trg_cell == null || src_cell == null) {
            mxUtils.alert(`ERROR: Component labeled >${source_label}< of type >${source_type}< has a connection that isn't connected at the one end` );
            return false;
        }
        //mxUtils.alert("Info: The source cell "+ cell.getId() + " the source terminal if " + src_cell.getId() + " The target cell "+ trg_cell.getId());
        // Doing this so no matter who the source or the target is it recognizes a 
        // connection
        var terminal_cells = [];
        terminal_cells.push(trg_cell)
        terminal_cells.push(src_cell)
        //terminal_cells = terminal_cells.filter(val => val.getID() !== source_id);
        terminal_cells = terminal_cells.filter(function(cell) { return cell.getId() !== source_id;});
        // What is left should be on the other end
        if (get_cell) {
            return terminal_cells[0];
        }
        else {
            return terminal_cells[0].getAttribute('type','NO_TYPE_FOUND');
        }
    }

    // From stackoverflow
    function isNumeric(num){
        num = "" + num; //coerce num to be a string
        return !isNaN(num) && !isNaN(parseFloat(num));
      }

    function link_connections(edge) {
        // Edges that connect processors to each other and to memory need to have a 
        // speed property and have a type property of "link"
        // Edge types that connect task to processors and data to memory should be of type "binding"
        // If needed repair edge properties
        const edge_type = edge.getAttribute('type', "NO_TYPE");
        const trg_cell = edge.getTerminal();
        const trg_type = trg_cell.getAttribute('type', "NO_TYPE");
        const trg_label = trg_cell.getAttribute('label', "NO_LABEL");
        const src_cell = edge.getTerminal(true);
        const src_type = src_cell.getAttribute('type', "NO_TYPE");
        const src_label = src_cell.getAttribute('label', "NO_LABEL");
        if ((trg_type == 'processor' && src_type == 'processor') ||
            (trg_type == 'memory' && src_type == 'processor') ||
            (trg_type == 'processor' && src_type == 'memory')) {
            // All good combinations for a Link
            if (edge_type == 'link') {
                // it's a link yeah!!!
            }
            else {
                // Fix it
                edge = convertEdge2Link(edge);
            }
        }
        if ((trg_type == 'processor' && src_type == 'task') ||
            (trg_type == 'task' && src_type == 'processor') ||
            (trg_type == 'memory' && src_type == 'data') ||
            (trg_type == 'memory' && src_type == 'data')) {
            // All good combinations for a Binding
            if (edge_type == 'binding') {
                // it's a binding yeah!!
            }
            else {
                // Fix it
                edge = convertEdge2Binding(edge);
            }
        }
        return true;
    }

    // Connection rules for the model. -1 means any number of connections. If not in the dictionary shouldn't be connected
    const task_match_end_types = {'processor': 1};
    const data_match_end_types = {'memory': 1};
    const memory_match_end_types = {'data': -1, 'processor': 1};
    const processor_match_end_types = {'task': -1, 'processor': -1, 'memory': -1};
    

    function allowed_connections(orig_cell, match_end_types_rules) {
        // Given a cell/component/vertex check that it is connected to the correct compenents
        // using the 'match_end_types_rules'
        var types_count = {};
        const edges_to_try = orig_cell.getEdgeCount();
        const source_label = orig_cell.getAttribute('label', "NO_LABEL");
        const source_type  = orig_cell.getAttribute('type');
        if (source_label == "NO_LABEL") {
            orig_cell.setAttribute('label', source_label)
            mxUtils.alert(`ERROR: Component of type >${source_type}< with label >${source_label}< isn\'t labeled`);
            return false;
        }
        if (edges_to_try == 0) {
            mxUtils.alert(`WARNING: Component of type >${source_type}< with label >${source_label}< isn\'t connected`);
        }

        for (var e=0; e < edges_to_try; e++) {
            var edge = orig_cell.getEdgeAt(e);
            var other_end_cell = get_other_end(orig_cell, edge, true);
            if (other_end_cell == false) {
                //highlight.highlight(edge);
                //mxUtils.alert(`ERROR: Component labeled >${source_label}< of type >${source_type}< has a connection to that isn't connected` );
                return false;
            } 
            var other_end_cell_label = other_end_cell.getAttribute('label');
            var cell_type = other_end_cell.getAttribute('type');
            if (cell_type in match_end_types_rules) {
                // So its is allowed to be connected
                var count = types_count[cell_type] || 0;
                count += 1;
                types_count[cell_type] = count;
            }
            else {
                if (typeof other_end_cell_label == 'undefined') {
                    other_end_cell_label = other_end_cell.getValue();
                }
                mxUtils.alert(`ERROR: Component labeled >${source_label}< of type >${source_type}< has a connection to component of type >${cell_type}< labeled >${other_end_cell_label}<` );
                return false;
            }
            for (const m_type in match_end_types_rules) {
                const allowed_count = match_end_types_rules[m_type];
                const found_count = types_count[m_type] || 0;
                if (allowed_count < 0) {
                    continue;
                }
                else if (found_count > allowed_count) {
                    mxUtils.alert(`ERROR: found ${found_count} > allowed ${allowed_count} Component labeled >${source_label}< of type >${source_type}< has a to many connections to components of type >${m_type}<` );
                    return false;
                }
            }

        }
        return true;
    }

    function check_diagram(graph) {
        var parent = graph.getDefaultParent();
        //var vertices = graph.getChildVertices(parent);
        var cells = graph.getChildCells(parent, false, false);
        // Highlights current cell

        var numCells = cells.length;
        // First check the objects
        // Used to check for duplicate labels
        var cell_labels = [];
        for (var i = 0; i < numCells; i++) {
            var this_cell = cells[i];
            var cell_label = this_cell.getAttribute('label', "NO_LABEL");
            var cell_type = this_cell.getAttribute('type', "NO_TYPE").toLowerCase();
            var cell_vertex = this_cell.isVertex();
            
            if (cell_vertex) {
                // Check cell stuff
                var vertex_types = ["task", "processor", "memory", "data"];
                if (vertex_types.includes(cell_type)) {
                    // recognized types
                    if (cell_type == 'task') {
                        if (!allowed_connections(this_cell, task_match_end_types)) {
                            return false;
                        }
                    } 
                    if (cell_type == 'data') {
                        if (!allowed_connections(this_cell, data_match_end_types)) {
                            return false;
                        }
                    } 
                    if (cell_type == 'memory') {
                        if (!allowed_connections(this_cell, memory_match_end_types)) {
                            return false;
                        }
                    }
                    if (cell_type == 'processor') {
                        if (!allowed_connections(this_cell, processor_match_end_types)) {
                            return false;
                        }
                    }
                }
                else {
                    // Unrecognized type or edges which is fine -
                    // Not all object need to be b4time model components
                    // this allows other information to be added to the chart 
                    // for documentation purposes
                }
            }
        }
        // Make sure all of the boxes are correct first
        // Then get the links
        for (var i = 0; i < numCells; i++) {
            var this_cell = cells[i];
            var cell_edge = this_cell.isEdge();
            if (cell_edge) {
                if (!link_connections(this_cell)) {
                    return false;
                }
            }
        }

        var labels_fine = true;
        for (var i = 0; i < numCells; i++) {
            var this_cell = cells[i];
            var cell_label = this_cell.getAttribute('label', "NO_LABEL");
            var cell_type = this_cell.getAttribute('type', "NO_TYPE").toLowerCase();

            // Check cell stuff
            var cell_types = ["task", "processor", "memory", "data", "link"];
            // It is okay if multiple bindings have the same label
            if (cell_types.includes(cell_type)) {
                // Check for duplicate labels
                if (cell_labels.includes(cell_label)) {
                    mxLog.show();
                    mxLog.debug(`ERROR: Multiple components detected with the same Label >${cell_label}<`);
                    labels_fine = false;
                }
                cell_labels.push(cell_label);
            }
        }
        if (!labels_fine) {
            mxUtils.alert(`ERROR: Diagram check failed. Multiple components detected with the same Label. Look at log window for more detail.`);
        }

        return labels_fine;
    }

/* Export Model ********************************************************************* */

    function get_connections(cell, connection_type) {
        // Given a cell get either the label(s) of the link(s) 
        // or the label of the object on the other end of a binding
        const edges_to_try = cell.getEdgeCount();
        var return_labels = [];
        for (var e=0; e < edges_to_try; e++) {
            var edge = cell.getEdgeAt(e);
            var edge_type = edge.getAttribute('type', 'NO_TYPE');
            if (edge_type == connection_type && connection_type == 'link') {
                var edge_label = edge.getAttribute('label', 'NO_LABEL');
                return_labels.push(edge_label);
            }
            if (edge_type == connection_type && connection_type == 'binding') {
                var other_cell = get_other_end(cell, edge, true);
                var other_label = other_cell.getAttribute('label', 'NO_LABEL');
                return_labels.push(other_label);
            }
        }
        return return_labels;
    }

    function getJSON(cell, result) {
        const cell_types = ["task", "processor", "memory", "data", "link"];
        const cell_type = cell.getAttribute('type', 'NO_TYPE');
        if (cell_types.includes(cell_type)) {
            var cell_label = cell.getAttribute('label', 'NO_LABEL');
            if (cell_type == 'memory') {
                result[cell_label] = {
                    'name': cell_label,
                    'type': 'memory',
                    'size': cell.getAttribute('size'),
                    'link': get_connections(cell, 'link')[0]
                };
            }
            if (cell_type == 'processor') {
                result[cell_label] = {
                    'name': cell_label,
                    'type': 'processor',
                    'speed': cell.getAttribute('speed'),
                    'links': get_connections(cell, 'link')
                };
            }
            if (cell_type == 'link') {
                result[cell_label] = {
                    'name': cell_label,
                    'type': 'link',
                    'speed': cell.getAttribute('speed')
                };
            }
            if (cell_type == 'data') {
                result[cell_label] = {
                    'name': cell_label,
                    'type': 'data',
                    'bound': get_connections(cell, 'binding')[0],
                    'current_size': cell.getAttribute('current_size', 0)
                };
            }
            if (cell_type == 'task') {
                result[cell_label] = {
                    'name': cell_label,
                    'type': 'task',
                    'callback': cell.getAttribute('task_name')
                };
            }
        }
        return result;
    }

    function create_json(filename) {
        // File name '/Users/aussie/projects/2021/simulate/b4time_output.json'
        var graph = ui.editor.graph;
        if (!check_diagram(graph)) {
            // Check failed
            mxUtils.alert(`FAILURE: Diagram check failed. JSON object not created.`);
            return false;
        }
        var json_obj = {};
        var parent = graph.getDefaultParent();
        var cells = graph.getChildCells(parent, false, false);
        var numCells = cells.length;
        for (var i = 0; i < numCells; i++) {
            var this_cell = cells[i];
            json_obj = getJSON(this_cell, json_obj);
        }
        var str = JSON.stringify(json_obj, null, 2); // spacing level = 2
        mxLog.debug(str);
        var fs = require('fs');
        var writer = fs.createWriteStream(filename);
        writer.write(str);
    }

    // From https://github.com/jgraph/drawio/blob/d76e39477bdf230ba6728dc488bd5896afb08425/src/main/webapp/js/diagramly/ElectronApp.js
    function getDocumentsFolder() {
        //On windows, misconfigured Documents folder cause an exception
        try
        {
            return require('electron').remote.app.getPath('documents');
        }
        catch(e) {}
        
        return '.';
    };

    function saveB4TimeFileDialog(save_callback) {
        const electron = require('electron');
        var remote = electron.remote;
        var dialog = remote.dialog;
        const sysPath = require('path');
        // Get stuff from cookies
        var lastDir = localStorage.getItem('.lastB4TimeDir');
        
        // More info about this object and using dialogshowSaveDialogSync can be found here
        // https://www.electronjs.org/docs/api/dialog#dialogshowsavedialogsyncbrowserwindow-options
        var save_b4time_model_options = {
            title: "Save B4Time model...",
            defaultPath: lastDir || getDocumentsFolder(),
            filters: [
                { name: 'b4time Models', extensions: ['b4tjson'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: [
                'createDirectory',
                'showOverwriteConfirmation'
            ]
        };

        // Here it is the big show get the file name to export/save the model
        var savepath = dialog.showSaveDialogSync(save_b4time_model_options);

        // savepath will be undefined on cancel of the save dialog
        if (savepath !== undefined)
        {
            mxLog.debug(`Save B4Time Model to ${savepath}`);
            var lastB4TimeDir = sysPath.dirname(savepath);
            mxLog.debug(`lastB4TimeDir ${lastB4TimeDir}`);
            localStorage.setItem('.lastB4TimeDir', lastB4TimeDir);
            // var fs = require('fs');
            // var pluginsDir = sysPath.join(getAppDataFolder(), '/plugins');
            create_json(savepath);
        }
        else {
            mxLog.debug(`Saving of B4Time Model Canceled`);
        }
    }


/* Exploration ********************************************************************* */

    // ui.showDialog(dlg.container, 300, 80, true, true);

    var AboutB4TimeDialog = function(editorUi)
    {
        var div = document.createElement('div');
        div.setAttribute('align', 'center');

        var h3 = document.createElement('h3');
        mxUtils.write(h3, 'About B4Time Plug-in');
        div.appendChild(h3);

        // var img = document.createElement('img');
        // img.style.border = '0px';
        // img.setAttribute('width', '176');
        // img.setAttribute('width', '151');
        // img.setAttribute('src', IMAGE_PATH + '/logo.png');
        // div.appendChild(img);

        mxUtils.br(div);
        mxUtils.write(div, 'Version: ' + b4time.VERSION);
        mxUtils.br(div);

        var link = document.createElement('a');
        link.setAttribute('href', 'http://www.jgraph.com/');
        link.setAttribute('target', '_blank');
        mxUtils.write(link, 'www.jgraph.com');
        div.appendChild(link);

        mxUtils.br(div);
        mxUtils.br(div);
        var closeBtn = mxUtils.button(mxResources.get('close'), function()
        {
            editorUi.hideDialog();
        });
        closeBtn.className = 'geBtn gePrimaryBtn';
        div.appendChild(closeBtn);
        
        this.container = div;
    };














    function getCellXML() {
        var enc = new mxCodec();
        var cells = graph.getSelectionCells();

        // Still log xml
        mxLog.debug(mxUtils.getPrettyXml(enc.encode(cells)));

        // Check to see if any of these are regular edges
        cells_count = cells.length;
        for (var i=0;i<cells_count;i++) {
            cell = cells[i];
            cell_edge = cell.isEdge();
            cell_type = cell.getAttribute('type', "NO_TYPE");
            if (cell_edge && cell_type == "NO_TYPE") {
                // Convert it to Link
                var ccell = convertEdge2Link(cell);
                // ccell.setAttribute('label', "Converted");
                // graph.refresh();
                // log change
                mxLog.debug("--> Converted <--");
                mxLog.debug(mxUtils.getPrettyXml(enc.encode(ccell)));


            }
        }
        

        if (false) {
            var xml = '<root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';
            var doc = mxUtils.parseXml(xml);
            var codec = new mxCodec(doc);
            var elt = doc.documentElement.firstChild;
            var cells = [];
            
            while (elt != null)
            {
            cells.push(codec.decode(elt));
            elt = elt.nextSibling;
            }

            graph.addCells(cells);
        }



    }



});