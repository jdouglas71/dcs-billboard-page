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
    var $oldYPos = 0;
    var $deltaV = 0;

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
    var topLimit = 600; //As measured from top
    var bottomLimit = 3140; //As measured from bottom
	/**
	 * Move the sprite section.
	 */
    var $sprite = jQuery('#dcs-billboard-sprite');
    var curPos = parseInt($sprite.css('top'),10);
	if( isNaN(curPos) || curPos <= 0 ) 
    {
        curPos = topLimit;        
        setTimeout( function() {
            $sprite.animate({ top : curPos },400,"linear");
            swapPanelImages( 1 );
        }, 2000);
    }

    jQuery(window).scroll(function() {
		var yPos = $window.scrollTop();
        var deltaY = yPos - $oldYPos; 
        $deltaV += deltaY;
        $oldYPos = yPos;
        var winHeight = $window.height();
		var curPos = parseInt($sprite.css('top'),10);
	    var ratio = 2.5;
        var curPanelEdge = getCurrentPanelEdge( curPos );
        var diff = yPos + winHeight - curPanelEdge;

        var moveIt = true;
        if( curPos > bottomLimit && (deltaY > 0) ) {
             moveIt = false; 
            //console.log( "Past bottom limit going down." );
        }
        if( curPos < topLimit && (deltaY < 0) )  {
            moveIt = false;
        }
        if( curPos > (yPos + winHeight - 250) && (deltaY > 0) ) {
            moveIt = false;
            //console.log( "lower window zone" );
        }
        if( curPos < (yPos + 200) && (deltaY < 0) )  {
            moveIt = false;        
            //console.log( "Upper window limit" );
        }
        isNearPanelEdge( curPos );

        if( moveIt )
		{
            var velocity = 2;
            $sprite.css( { 'top' : curPos+(deltaY*velocity) } );
	    }
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
        if( (delta < 305) && (delta >= 0) )
        {   
            //We only care if we're in a swappable panel.
            if( !swapState[panelNum-1] ) 
            {
                //console.log( "SLOWER DOWN!" );
                retval = true;
                if( delta < 250 ) swapPanelImages(panelNum);
            }
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
            if( $oldPanel != 0 ) 
                jQuery('img#bg-panel-'+ $oldPanel).toggleClass("transparent");
            $oldPanel = panelNum;
			//swapState[panelNum-1] = true;
		}
    }
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("article");
document.createElement("section");
