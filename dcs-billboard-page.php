<?php 
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
/**
 * Plugin Name: DCS Billboard Page
 * Description: Defines a page as a set of "billboard" panels with a counter scrolling sprite in the foreground. i
 * As the sprite scrolls past the panel, they update their image using a crossfade. 
 * Currently specific to the TouchJet website but eventually will be genericized.
 * Author: Jason Douglas
 * Version: 0.2
 * License: GPL2
 */

/**
 * Enqueue css and js files.
 */
function dcs_billboard_page_load_scripts()
{
    wp_register_style( 'dcs_billboard_page_style', plugin_dir_url(__FILE__).'dcs-billboard-page.css' );
    wp_enqueue_style( 'dcs_billboard_page_style' );

    wp_register_script( 'jquery-spritely', plugin_dir_url(__FILE__).'/js/jquery.spritely.js', array('jquery') );
    wp_enqueue_script( 'jquery-spritely' );

    wp_register_script( 'dcs_billboard_page_script', plugin_dir_url(__FILE__).'dcs-billboard-page.js', array('jquery') );
    wp_enqueue_script( 'dcs_billboard_page_script' );
}
//if(is_page('Home')) 
    add_action( 'wp_enqueue_scripts', 'dcs_billboard_page_load_scripts' );

/**
 * Short code for the billboard page.
 */ 
function dcs_billboard_page_shortcode($atts, $content=null)
{
    extract( shortcode_atts( array( ), $atts ) );
    $retval = "<section class='bg-panel'>";
    $retval .= dcs_billboard_page_getSprite();
    $retval .= dcs_billboard_page_getPanel( 1 );
    $retval .= dcs_billboard_page_getPanel( 2 );
    $retval .= dcs_billboard_page_getPanel( 3 );
    $retval .= dcs_billboard_page_getPanel( 4 );
    $retval .= dcs_billboard_page_getPanel( 5 );
    $retval .= dcs_billboard_page_getPanel( 6 );
    $retval .= dcs_billboard_page_getPanel( 7 );
	$retval .= "</section>";
    return $retval;
}
add_shortcode( 'dcs_billboard_page', 'dcs_billboard_page_shortcode' );

/**
 * Get the Sprite code.
 */
function dcs_billboard_page_getSprite()
{
	$retval = "<section id='dcs-billboard-sprite' data-type='sprite'>";
	$retval .= "<input type='text' id='dcs-billboard-sprite-text' value=''>";
	$retval .= "</section>"; 
	
	return $retval;
}

/**
 * Central Panel Code Getter
 */
function dcs_billboard_page_getPanel($index)
{
    $retval = "";

	switch($index)
	{
		case 1:
		case 3:
		case 4:
		case 5:
			$retval .= "<div class='bg-panel' id='bg-panel-".$index."'>";
			$retval .= "	<img id='bg-panel-".$index."' src='".plugin_dir_url(__FILE__)."/images/panel".$index."_0.png'>";
			$retval .= "	<img id='bg-panel-mobile-".$index."' src='".plugin_dir_url(__FILE__)."/images/mobile/panel".$index.".png'>";
			$retval .= "</div>";
			break;
        case 2:
        	$retval .= "<div class='bg-panel' id='bg-panel-2'>                                                        ";
			$retval .= "	<img id='bg-panel-mobile-".$index."' src='".plugin_dir_url(__FILE__)."/images/mobile/panel".$index.".png'>";
			$retval .= "	<div class='left'>                                                                         ";
			$retval .= "		<div id='one' class='hover-class'>                                          ";
			$retval .= "			<div class='line-img'></div>";
			$retval .= "			<span>Download any app onto the Touchjet Pond.</span>           ";
			$retval .= "		</div>                                                                                 ";
			$retval .= "		<div id='two'>                                                                         ";
			$retval .= "			<div class='line-img'></div>";
			$retval .= "			<span>Control your apps right on the wall.</span>          ";
			$retval .= "		</div>                                                                                 ";
			$retval .= "		<div id='three'>                                                                       ";
			$retval .= "			<div class='line-img'></div>";
			$retval .= "			<span>Works without wires for ultimate portability.</span>                ";
			$retval .= "		</div>                                                                                 ";
			$retval .= "	</div>                                                                                     ";
			$retval .= "	<div class='right'>                                                                        ";
			$retval .= "		<hr class='blue-line'>                                                         ";
			$retval .= "	</div>                                                                                     ";
			$retval .= "</div>                                                                                        ";
            break;
        case 6:
           	$retval .= "<div class='bg-panel' id='bg-panel-".$index."'>";
			$retval .= "	<img id='bg-panel-".$index."' src='".plugin_dir_url(__FILE__)."/images/panel".$index.".png'>";
			$retval .= "	<img id='bg-panel-mobile-".$index."' src='".plugin_dir_url(__FILE__)."/images/mobile/panel".$index.".png'>";
           	$retval .= "    <div class='learn-more'>";
            $retval .= "        <a name='features' style='position:relative;padding-top:600px;'>";
            $retval .= "        <a href='http://touchjetweb.myshopify.com/products/touchjet-pond'>Learn More></a></a>";
			$retval .= "    </div>";
			$retval .= "</div>";
            break;
        case 7:
	    	$retval .= "<div class='bg-panel' id='bg-panel-".$index."'>";
			$retval .= "	<img id='bg-panel-".$index."' src='".plugin_dir_url(__FILE__)."/images/panel".$index.".png'>";
			$retval .= "	<img id='bg-panel-mobile-".$index."' src='".plugin_dir_url(__FILE__)."/images/mobile/panel".$index.".png'>";
	        $retval .= "    <div class='buy-button'>";
            $retval .= "        <a class='buy-button' href='http://touchjetweb.myshopify.com/cart/1184020345:1'>Buy</a>";
            $retval .= "    </div>";
		    $retval .= "</div>";
            break;
	default:
			$retval .= "<div class='bg-panel' id='bg-panel-".$index."'>";
			$retval .= "	<img id='bg-panel-".$index."' src='".plugin_dir_url(__FILE__)."/images/panel".$index.".png'>";
			$retval .= "	<img id='bg-panel-mobile-".$index."' src='".plugin_dir_url(__FILE__)."/images/mobile/panel".$index.".png'>";
			$retval .= "</div>";
	}

    return $retval;
}

