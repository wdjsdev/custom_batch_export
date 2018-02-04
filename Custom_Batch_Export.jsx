/*

	Script Name: Custom Batch Export
	Author: William Dowling
	Creation Date: January 27, 2018
	Description:
		Batch a folder of .ai files
		and export each artboard of each
		.ai file as svg, pdf, and multiple
		sizes of png.
	
	Usage:
		Backup your folder of .ai files.
		Execute the script from File > Scripts > Custom_Batch_Export.jsx
		Select the folder you want to batch process
		Click "Open"
		Sit back and relax.	

	Disclaimer:
		Author is not responsible for any harm
		done to your file system as a result of
		usage of this script. It is merely a tool
		and you should always ensure you have proper
		backups of any files you are going to batch
		process. Never run this script or any
		batch script on your only copy of a folder.

*/

function CustomBatchExport()
{

	//SETTINGS VARIABLES

		//SHOW_EXECUTION_DURATION
		//set to true to receive an alert 
		//with the script execution duration 
		//in milliseconds.
		const SHOW_EXECUTION_DURATION = false;

		//PNG_EXPORT_SIZES
		//add or remove any png sizes as needed.
		//values are in points. a 72dpi output is
		//assumed which makes for a 1:1 conversion
		//from points to pixels.
		//If the export resolution is different,
		//then these sizes will have to be updated
		//to accomodate that.
		var PNG_EXPORT_SIZES =
			[
				24,
				32,
				48,
				72,
				96,
				120,
				144,
				192,
				240,
				480
			]

	///////Begin/////////
	///Logic Container///
	/////////////////////


	function stopWatch()
	{
		return new Date().getTime();
	}

	// PDF
	// PDF
	function setPdfOptions(abIndex)
	{
		var options = new PDFSaveOptions();
		options.artboardRange = "" + (abIndex + 1);
		options.preserveEditability = false;
		return options;
	}

	function savePdf(doc, filePath, options, artboardIndex, artboardName)
	{
		var destFile = new File(filePath + "/" + artboardName + ".pdf");
		doc.saveAs(destFile, options, artboardIndex, artboardName);
	}


	// PNG
	// PNG
	function setPngOptions(scaling)
	{
		var options = new ExportOptionsPNG24();
		options.antiAliasing = true;
		options.transparency = true;
		options.artBoardClipping = true;
		options.horizontalScale = scaling;
		options.verticalScale = scaling;
		return options;
	}

	function savePng(doc, filePath, options, artboardIndex, artboardName)
	{
		var destFile = new File(filePath + "/" + artboardName + ".png");
		doc.exportFile(destFile, ExportType.PNG24, options);
	}


	// SVG
	// SVG
	function setSvgOptions(abIndex)
	{
		var options = new ExportOptionsSVG();
		options.preserveEditability = false;
		options.saveMultipleArtboards = true;
		options.artboardRange = "" + (abIndex + 1);
		return options;
	}


	function saveSvg(doc, filePath, options, artboardIndex, artboardName)
	{
		var destFile = new File(filePath + "/" + artboardName + ".svg");
		var tempFolder = new Folder(Folder.temp + "/tmpFolder" + artboardName);
		if(!tempFolder.exists){tempFolder.create()};

		var tempFile = new File(tempFolder.fsName + "/" + artboardName + ".svg");

		doc.exportFile(tempFile, ExportType.SVG, options);

		//verify the file was exported
		var tempFolderContents = tempFolder.getFiles();
		if(!tempFolderContents.length)
		{
			errorList.push("Failed to export the artboard: " + artboardName + ".");
			tempFolder.remove();
		}
		else
		{
			tempFile = tempFolderContents[0];
			tempFile.copy(destFile);
			tempFile.remove();
			tempFolder.remove();
		}
		
	}



	function getScale(curWidth, desired)
	{
		return (desired / curWidth) * 100;
	}

	function getAbWidth(artboard)
	{
		return artboard.artboardRect[2] - artboard.artboardRect[0];
	}

	function getDestFolder()
	{
		var destFolder = new Folder("~/Desktop").selectDlg("Where do you want to save the assets for " + docRef.name + "?");
		return destFolder;
	}

	function consolidateLayers()
	{
		tempLayer = layers.add();
		// tempLayer.name = docRef.name.replace(/\.ai[t]?/,"");

		//move all artwork onto tempLayer
		for(var x=1,len=layers.length;x<len;x++)
		{
			curLayer = layers[x];
			for(var y=curLayer.pageItems.length-1;y>=0;y--)
			{
				curLayer.pageItems[y].moveToBeginning(tempLayer);
			}
		}

		//remove empty layers
		for(var x=layers.length-1;x>0;x--)
		{
			layers[x].remove();
		}
	}

	function exportArtboards()
	{
		docRef = app.activeDocument;
		aB = docRef.artboards;
		layers = docRef.layers;
		curDocFolder = new Folder(workingFolderPath + "/" + docRef.name.substring(0,docRef.name.lastIndexOf(".")));
		if(!curDocFolder.exists)
		{ 
			curDocFolder.create();
		}
		curFilePath = curDocFolder.fsName;

		//move all the artwork to a single temporary layer,
		//then remove the rest of the layers to prevent
		//empty layers from remaining in exported SVG files.
		consolidateLayers();

		//process each artboard
		for (var x = 0, len = aB.length; x < len; x++)
		{
			aB.setActiveArtboardIndex(x);
			curAbName = aB[x].name;
			tempLayer.name = curAbName;

			//export pdf
			curPdfFolder = new Folder(curFilePath + "/PDF/");
			if (!curPdfFolder.exists)
			{
				curPdfFolder.create();
			};
			pdfOptions = setPdfOptions(x);
			savePdf(docRef, curPdfFolder, pdfOptions, x, curAbName);

			//export svg
			curSvgFolder = new Folder(curFilePath + "/SVG/");
			if (!curSvgFolder.exists)
			{
				curSvgFolder.create();
			};
			// svgOptions = setSvgOptions(x);
			svgOptions = setSvgOptions(x);
			saveSvg(docRef, curSvgFolder, svgOptions, x, curAbName);

			//export one png for each size in the PNG_EXPORT_SIZES array
			curScale = getAbWidth(aB[x]);

			curPngFolder = new Folder(curFilePath + "/PNG/");
			if(!curPngFolder.exists)
			{
				curPngFolder.create();
			}
			for (var y = 0, pngLen = PNG_EXPORT_SIZES.length; y < pngLen; y++)
			{
				newScale = getScale(curScale, PNG_EXPORT_SIZES[y]);
				pngOptions = setPngOptions(newScale);
				curPngSizeFolder = new Folder(curPngFolder + "/" + PNG_EXPORT_SIZES[y] + "w");
				if (!curPngSizeFolder.exists)
				{
					curPngSizeFolder.create();
				};

				savePng(docRef, curPngSizeFolder, pngOptions, x, curAbName);
			}
		}

		curFilePath = null;
	}

	eval("@JSXBIN@ES@2.0@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");

	


	////////End//////////
	///Logic Container///
	/////////////////////

	if(SHOW_EXECUTION_DURATION)
	{
		var startTime = stopWatch();
	}

	var valid = true;

	var user = $.getenv("USER")
	var desktopPath = "/Volumes/Macintosh HD/Users/" + user + "/Desktop/";
	var desktopFolder = new Folder(desktopPath);

	var errorList = [];

	var docRef, aB, layers, tempLayer, workingFolderPath,curFilePath;
	var pngOptions, pdfOptions, svgOptions;
	var curScale, newScale;
	var curAbName;
	//folder variables
	var curPdfFolder, curSvgFolder, curPngFolder, curPngSizeFolder;

	

	batchInit(exportArtboards);

	if(SHOW_EXECUTION_DURATION)
	{
		var endTime = stopWatch();
	}
	
	if(errorList.length)
	{
		alert("The following errors occurred:\n" + errorList.join(",\n"));
	}
	else
	{
		if (SHOW_EXECUTION_DURATION)
		{
			alert("Execution took " + (endTime - startTime) + " milliseconds.");
		}
	}


}
CustomBatchExport();