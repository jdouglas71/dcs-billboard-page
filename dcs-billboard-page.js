/**
 * Billboard + Sprite Front Page for TouchJet.
 *  
 * Author: Jason Douglas
 */

/**
 * TODO: Handle scaling.
 */

jQuery(document).ready(function()  {
	// Cache the Window object
	$window = jQuery(window);
    var $oldPanel = 0, $oldYPos = 0, $deltaY = 0;
    var topLimit, bottomLimit;
    
    /** Background Section Processing */
    //The panel sizes 
    var panelSizes = new Array( 1475, 728, 1200, 1200, 1200, 753, 1291);
	var scaleFactor = 0.5;
	var panelWidth = 2400; //Starting image widths

	/** Dictates the "Swap state" of the panels. 2,6 and 7 don't have swap panels.*/
	var swapState = new Array( true, false, true, true, true, false, false );
	//Adjust the scale factor based on the window width.
    processScaleFactorChange( $window.width() );
    
	/**
	 * Initial Sprite Positioning. 
	 */
    var $sprite = jQuery('#dcs-billboard-sprite');
    var curPos = parseInt($sprite.css('top'),10);
    curPos = massageCurrentPosition( curPos );
    /** Move the sprite */
    setTimeout( function() {
        $sprite.animate({ top : curPos },1000,"linear");
        swapPanelImages( 1 );
    }, 1000);
    /** Handle any swapping */
    isNearPanelEdge( curPos );
    tweakPanelTwo( curPos );

	/**
	 * Handle resize events. We need to recalculate the scaleFactor
	 */
	jQuery(window).resize( function() {
		processScaleFactorChange( jQuery("section.bg-panel").width() );
	});

	/** 
	* React to scrolling events 
	*/
    jQuery(window).scroll(function()  {
		var yPos = $window.scrollTop();
        $deltaY = yPos - $oldYPos; 
        $oldYPos = yPos;
        var winHeight = $window.height();
		var curPos = parseInt($sprite.css('top'),10);
		var panelNum = getPanelNumber( curPos );
		jQuery('#dcs-billboard-sprite-text').val( "panel num: " + panelNum + " " + curPos );
	    var ratio = 2.5;
        var curPanelEdge = getCurrentPanelEdge( curPos );
        var diff = yPos + winHeight - curPanelEdge;
        
        //var newCurPos = massageCurrentPosition( curPos );
        //if( newCurPos != curPos )
       // {
       // 	$sprite.animate( {top:newCurPos}, 500, "linear" );
       // 	curPos = newCurPos;
       // }	

		//Determine if to move
        var moveIt = true;
        if( curPos > bottomLimit && ($deltaY > 0) ) {
             moveIt = false; 
            //console.log( "Past bottom limit going down." );
        }
        if( curPos < topLimit && ($deltaY < 0) )  {
            moveIt = false;
        }
        if( curPos > (yPos + winHeight - 250) && ($deltaY > 0) ) {
            moveIt = false;
            //console.log( "lower window zone" );
        }
        if( curPos < (yPos + topLimit) && ($deltaY < 0) )  {
            moveIt = false;        
            //console.log( "Upper window limit" );
        }
        
        //Triggers panel swapping
        var isNearEdge = isNearPanelEdge( curPos );
        tweakPanelTwo( curPos );
		//Move the sprite
        if( moveIt )
		{
            var velocity = 2.3;
            if( isNearEdge ) velocity = 0.75;
            //console.log( "Velocity: " + velocity );
            var delta = $deltaY*velocity;
            //if( Math.abs(delta) > 3 )         
            //	$sprite.animate({ 'top' : curPos+delta },400,"swing");
            //else 
            	$sprite.css( { 'top' : curPos+delta } );
	    }
    }); 
    
    /**
    * Calculate panels sizes based on scalefactor
    */
    function processScaleFactorChange(newWidth)
    {
    	scaleFactor = newWidth/2400;
    	
    	//This is our only flexible panel so we need to keep it sized correctly.
    	jQuery('div#bg-panel-2').height( panelSizes[1]*scaleFactor ); 
    	
    	/** Foreground Section Processing */
    	topLimit = 1200*scaleFactor; //As measured from top
    	bottomLimit = (6143+300)*scaleFactor; //As measured from bottom
    }
    
    /**
    * Get the Panel number based on curPos.
    */
    function getPanelNumber(curPos)
    {
    	var i = 0, farEdge = 0, nearEdge = 0, tmpVal = 0;
    	for(i=0; i<panelSizes.length; i++)
    	{
    		nearEdge = farEdge;
    		console.log( "panel " + (i+1) + " size: " + (panelSizes[i]*scaleFactor) );
    		farEdge = nearEdge + (panelSizes[i]*scaleFactor);
    		console.log( "panel " + (i+1) + " top edge " + nearEdge + " bottom Edge: " + farEdge );
    		if( curPos > nearEdge && curPos < farEdge )
    		{
    			return (i+1);
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
		var panelSize = panelSizes[panelNum-1]*scaleFactor;
		var swapRange = 0.5;
		var speedRange = 0.45;
		
		//If the panel numbers change, swap the old one back.
		if( panelNum != $oldPanel ) 
            jQuery('img#bg-panel-'+ $oldPanel).removeClass("transparent");
                
        if( $deltaY > 0 )
        {   
        	//Going down
	        var delta = getCurrentPanelEdge(curPos) - curPos;
            //We only care if we're in a swappable panel.
            if( swapState[panelNum-1] ) 
            {
                if( delta < (panelSize*swapRange) ) 
                {
                	//We only care going down. 
                	//console.log( "SLOWER DOWN!" );
                 	swapPanelImages(panelNum);
                }	
                if( (delta < (panelSize*speedRange)) )
                {
                	retval = true;
                }
            }
            else if( (panelNum == 2) && (delta < (panelSize*speedRange)) )
            {
            	retval = true;
            }
            else
            {
            	retval = false;
            }
        }
        else
        {
        	//Going up.
        	var delta = curPos - getCurrentPanelEdge(curPos);
        	if( delta < (panelSize*.99) ) 
        	{
        		console.log( "Going up, calling for swap: " + panelNum );
        		swapPanelImages(panelNum);
        	}
        	retval = false;
        }
        
        return retval;
    }
    
    /**
    * Panel Two tweaks.
    */
    function tweakPanelTwo(curPos)
    {
    	 var topEdge = panelSizes[0]*scaleFactor;
    	 var bottomEdge = topEdge + (panelSizes[1]*scaleFactor);
    	 var aThird = (bottomEdge - topEdge)/3;
    	 var spriteHeight = $sprite.height();
    	 
    	 //console.log( "bottomEdge: " + bottomEdge + " topEdge: " + topEdge );
    	 //console.log( "curPos: " + curPos + " sprite height: " + spriteHeight);
    	 
    	 var pos = curPos + spriteHeight;
    	 
    	 if( (pos > topEdge) && (pos < (topEdge+aThird)) ) 
    	 {
    	 	//console.log( "Panel 2, First Third" );
    	 	jQuery("li#one").addClass("hover-class");
    	 	jQuery("li#two").removeClass("hover-class");
    	 	jQuery("li#three").removeClass("hover-class");
    	 }
    	 else if( (pos > (topEdge+aThird)) && (pos < (topEdge+(aThird*2))) ) 
    	 {
    	 	//console.log( "Panel 2, Second Third" );
    	 	jQuery("li#one").removeClass("hover-class");
    	 	jQuery("li#two").addClass("hover-class");
    	 	jQuery("li#three").removeClass("hover-class");
    	 }
    	 else if( (pos > (topEdge+(aThird*2)) && (pos < bottomEdge)) ) 
    	 {
    	 	//console.log( "Panel 2, Third" );
    	 	jQuery("li#one").removeClass("hover-class");
    	 	jQuery("li#two").removeClass("hover-class");
    	 	jQuery("li#three").addClass("hover-class");
    	 }
    	 else
    	 {
    	 	//console.log( "Not in Panel 2" );
    	 	jQuery("li#one").removeClass("hover-class");
    	 	jQuery("li#two").removeClass("hover-class");
    	 	jQuery("li#three").removeClass("hover-class");
    	 }
    }

    /**
     * Get the current panel edge.
     */
    function getCurrentPanelEdge(curPos)
    {
        var i = 0, curPanelEdge = 0;
        var panelNum = getPanelNumber(curPos);
        if( $deltaY < 0 ) panelNum--; //If we're going up, we want the panel edge on the top.
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
		if( swapState[panelNum-1] && ($oldPanel != panelNum) )
		{
            console.log( "Swapping Panel: " + panelNum );
            jQuery('img#bg-panel-'+panelNum).addClass("transparent");
            $oldPanel = panelNum;
		}
		
		if( !swapState[panelNum-1] ) 
		{
			$oldPanel = panelNum; //Record the panel number change anyway
		}
    }
    
    /**
     * Massage Current Postion 
     */
    function massageCurrentPosition(curPos)
	{	
	    var winTop = $window.scrollTop();
    	var winBot = winTop + $window.height();

		//If negative or not defined, start from the starting position.
		if( isNaN(curPos) || curPos <= 0 ) 
    	{
        	curPos = topLimit;        
    	}
    	
    	//If 
    	if( winBot > bottomLimit || curPos > bottomLimit )
    	{
    		curPos = bottomLimit;
    	}
    	else if( curPos < winTop || curPos > winBot )
    	{
    		curPos = winTop + ($window.height()*0.75);
    	}
		return curPos;
	}
    
}); 

/** 
 * Create HTML5 elements for IE's sake
 */
document.createElement("section");
