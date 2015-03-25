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
    var topLimit = 500; //As measured from top
    var bottomLimit = 3145; //As measured from bottomo
	/**
	 * Move the sprite section.
	 */
	jQuery('section[data-type="sprite"]').each(function() {
		var $sprite = jQuery(this); // assigning the object

		jQuery(window).scroll(function() {
            //Get the yPos of the top of the window
			var yPos = $window.scrollTop();
			var curPos = parseInt($sprite.css('top'),10);
			if( isNaN(curPos) ) curPos = topLimit;        
		    var ratio = Math.round(sectionSize/$window.height()) + 5;
	 		if( (curPos < bottomLimit) && !isNearPanelEdge(curPos) )// || (curPos > (yPos+$window.height()-200)) )  
			{
				//yPos += jQuery(window).scrollTop()/ratio;
				yPos += jQuery(window).scrollTop()/50;
				yPos += topLimit;
				console.log( "FG yPos: " + yPos );
				$sprite.css( { top : yPos } );              
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
     * Return true if close to (swappable) panel edge.
     * Price is Right rules apply.
     */
    function isNearPanelEdge(curPos)
    {
        var retval = false;
        var panelNum = getPanelNumber(curPos);
        var delta = getCurrentPanelEdge(curPos) - curPos;
        //console.log( "curPanelEdge: " + curPanelEdge );
        if( (delta < 105) && (delta >= 0) )
        {   
            //console.log( "SLOWER DOWN!" );
            retval = true;
            if( delta < 80 ) swapPanelImages(panelNum);
        }
        return retval;
    }

    /**
     * Get the current panel edge.
     */
    function getCurrentPanelEdge(curPos)
    {
        var i = 0, curPanelEdge = 0;
        var panelNum = getPanelNumber(curPos);
        for(i=0; i<panelNum; i++)
        {
            curPanelEdge += panelSizes[i]*scaleFactor;
        }
        return curPanelEdge;
    }

    /**
     * Swap images
     */
    function swapPanelImages(panelNum)
    {
		if( !swapState[panelNum-1] )
		{
            console.log( "Swapping Panel: " + panelNum );
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
