/**
 * Parallax Front Page for TouchJet.
 *  
 * Author: Jason Douglas
 */

/**
 * TODO: Handle scaling.
 */

jQuery(document).ready(function()  {
	// Cache the Window object
	$window = jQuery(window);
    var $oldPanel = 0;

    /** Background Section Processing */
    //The panel sizes 
    var panelSizes = new Array( 738, 364, 600, 600, 600, 531, 614);
	var scaleFactor = 1.0;
    //Calculate the size of the section based on all the panels and set it. 
    var sectionSize = 0, i = 0;
    for(i=0; i < panelSizes.length; i++)
    {   
        sectionSize += Math.round(panelSizes[i]*scaleFactor);
    }

	/**                                          
	 * Set the heights of the panel divs.
	 */
	i = 0;
	jQuery('div.bg-panel').each(function() {
		jQuery(this).height(Math.round(panelSizes[i++]*scaleFactor));
		jQuery(this).width(1200);
	});

	/** Track the "Swap state" of the panels. 2,6 and 7 don't have swap panels.*/
	var swapState = new Array( false, true, false, false, false, true, true );
	
    /** Foreground Section Processing */
    var topLimit = 550; //As measured from top
    var bottomLimit = 3045; //As measured from bottomo
    var deltaFG = bottomLimit - topLimit;
	/**
	 * Move the foreground section.
	 */
	jQuery('section[data-type="foreground"]').each(function(){
		var $fgobj = jQuery(this); // assigning the object
		var ratio = Math.round(sectionSize/$window.height()) + 5;

		jQuery(window).scroll(function() {
			var yPos = $window.scrollTop();
			prevSchool = yPos;
			var curPos = parseInt($fgobj.css('top'),10);
			if( isNaN(curPos) ) curPos = topLimit;        
			var panelNum = getPanelNumber(curPos); 
            if( (panelNum != $oldPanel) )  
            {
                var timeout = 700;
                if( panelNum == 1 ) timeout = 3000;
                console.log( "SWAPPING" );
                setTimeout(function() {swapPanelImages( panelNum );}, timeout );
            }
            $oldPanel = panelNum;
            //console.log( "Panel Number: " + getPanelNumber(curPos) );
			//console.log( "curPos: " + curPos );
			//console.log( "yPos+topLimit: " + (yPos+topLimit) );
			//console.log( "ratio: " + ratio );
			if( (curPos < bottomLimit) || (curPos > (yPos+$window.height()-200)) )  
			{
				yPos += jQuery(window).scrollTop()/ratio;
				yPos += topLimit;
				//console.log( "FG yPos: " + yPos );
				$fgobj.css( { top : yPos } );              
			}
		}); 
	});

	/**
	 * Get the panel number based on curPos.
	 */
	function getPanelNumber(curPos)
	{
		var i = 1;
		var total = panelSizes[0]*scaleFactor;
		for(i=1; i<panelSizes.length; i++, total += panelSizes[i]*scaleFactor)
		{
			if( curPos < total )
			{
				return i;
			}
		}
	}

    /**
     * Swap images
     */
    function swapPanelImages(panelNum)
    {
		if( !swapState[panelNum-1] )
		{
            //console.log( "Swapping Panel: " + panelNum );
            jQuery('img#bg-panel-'+panelNum).toggleClass("transparent");
			swapState[panelNum-1] = true;
		}
    }
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("article");
document.createElement("section");
