function CustomBatchExport()
{

	//SETTINGS VARIABLES

		//SHOW_EXECUTION_DURATION
		//set to true to receive an alert 
		//with the script execution duration 
		//in milliseconds.
		const SHOW_EXECUTION_DURATION = false;

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
		options.preserveEditability = true;
		return options;
	}

	function saveSvg(doc, filePath, options, artboardIndex, artboardName)
	{
		var destFile = new File(filePath + "/" + artboardName + ".svg");
		doc.exportFile(destFile, ExportType.SVG, options);
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

	function exportArtboards()
	{
		docRef = app.activeDocument;
		aB = docRef.artboards;
		curDocFolder = new Folder(workingFolderPath + "/" + docRef.name.substring(0,docRef.name.lastIndexOf(".")));
		if(!curDocFolder.exists)
		{ 
			curDocFolder.create();
		}
		curFilePath = curDocFolder.fsName;

		//process each artboard
		for (var x = 0, len = aB.length; x < len; x++)
		{
			aB.setActiveArtboardIndex(x);
			curAbName = aB[x].name;

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
			svgOptions = setSvgOptions(x);
			saveSvg(docRef, curSvgFolder, svgOptions, x, curAbName);

			//export one png for each size in the pngExportSizes array
			curScale = getAbWidth(aB[x]);

			for (var y = 0, pngLen = pngExportSizes.length; y < pngLen; y++)
			{
				newScale = getScale(curScale, pngExportSizes[y]);
				pngOptions = setPngOptions(newScale);
				curPngFolder = new Folder(curFilePath + "/" + pngExportSizes[y] + "w");
				if (!curPngFolder.exists)
				{
					curPngFolder.create();
				};

				savePng(docRef, curPngFolder, pngOptions, x, curAbName);
			}
		}

		curFilePath = null;
	}

	eval("@JSXBIN@ES@2.0@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");


	// //*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//
	// //*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//
	// //*/*/*/*/*/*/*/*/*/*/*///Batch Functions//
	// 	/*
	// 		batch_framework

	// 		dependencies:
	// 		UI_framework
	// 	*/


	// 	//this is the array of files that will be processed
	// 	var batchFiles = [];

	// 	//variable to hold the window object
	// 	var w;

	// 	//variable to hold the batched files destination folder
	// 	var saveDest;


	// 	//initialization function
	// 	function batchInit(func)
	// 	{
	// 		getBatchFiles();
	// 		if(valid && batchFiles.length)
	// 		{
	// 			executeBatch(func);
	// 		}
	// 	}





	// 	/*
	// 		Component Name: get_batch_files
	// 		Author: William Dowling
	// 		Creation Date: 03 December, 2017
	// 		Description: 
	// 			prompt user for a folder to batch and
	// 			then open all the .ai files in that
	// 			directory. return an array of all files opened
	// 		Arguments
	// 			none
	// 		Return value
	// 			array of file objects

	// 	*/

	// 	function getBatchFiles()
	// 	{
	// 		var sourceFolder = desktopFolder.selectDlg("Choose a *Source* Folder.");

	// 		if (sourceFolder)
	// 		{
	// 			workingFolderPath = sourceFolder.fsName;
	// 			batchFiles = openBatchFiles(sourceFolder, ".ai");
	// 		}
	// 		else
	// 		{
	// 			errorList.push("Couldn't determine the batch folder.");
	// 			valid = false;
	// 		}
	// 	}




	// 	/*
	// 		Component Name: open_batch_files
	// 		Author: William Dowling
	// 		Creation Date: 13 November, 2017
	// 		Description: 
	// 			open all files in a given folder
	// 			of a given extension
	// 		Arguments
	// 			folder object
	// 			string representing valid file extension
	// 		Return value
	// 			array of files that have been opened

	// 	*/
	// 	function openBatchFiles(filePath,ext)
	// 	{
	// 		var result = [];

	// 		var folder = Folder(filePath);
	// 		if(!folder.exists)
	// 		{
	// 			errorList.push("Failed to find the folder: " + folder.fsName);
	// 			return false;
	// 		}
			
	// 		var files = folder.getFiles();
	// 		var len = files.length;
	// 		for(var x=0;x<len;x++)
	// 		{
	// 			if(files[x].name.indexOf(ext) === files[x].name.length - ext.length)
	// 			{
	// 				app.open(files[x]);
	// 				result.push(app.activeDocument);
	// 			}
	// 		}

	// 		if(!result.length)
	// 		{	
	// 			errorList.push("No " + ext + " files were found in the folder.");
	// 			valid= false;
	// 		}

	// 		$.writeln("openBatchFiles returned: " + result);
	// 		return result;
	// 	}




	// 	/*
	// 		Component Name: execute_batch
	// 		Author: William Dowling
	// 		Creation Date: 04 December, 2017
	// 		Description: 
	// 			run the given function on each of
	// 			the given files, then save each
	// 			file into the given destination folder
	// 		Arguments
	// 			batchFiles
	// 				array of file objects
	// 			func
	// 				the function to be executed on each file
	// 		Return value
	// 			void

	// 	*/

	// 	function executeBatch(func)
	// 	{
	// 		var saveFile;
	// 		var docRef;


	// 		for (var x = batchFiles.length - 1; x >= 0; x--)
	// 		{
	// 			docRef = batchFiles[x];
	// 			docRef.activate();
	// 			try
	// 			{
	// 				func();
	// 			}
	// 			catch(e)
	// 			{
	// 				errorList.push("Failed to execute the batch function on the file: " + docRef.name);
	// 				errorList.push("System error message was: " + e);
	// 			}
	// 		}

	// 		for (var x = batchFiles.length - 1; x >= 0; x--)
	// 		{
	// 			docRef = app.activeDocument;
	// 			// saveFile = new File(saveDest.fsName + "/" + docRef.name);
	// 			// docRef.saveAs(saveFile);
	// 			docRef.close(SaveOptions.DONOTSAVECHANGES);
	// 		}
	// 	}



	// //*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//
	// //*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//


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

	var docRef, aB, workingFolderPath,curFilePath;
	var pngOptions, pdfOptions, svgOptions;
	var curScale, newScale;
	var curAbName;
	//folder variables
	var curPdfFolder, curSvgFolder, curPngFolder;

	var pngExportSizes =
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
			480,
		]

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