	<ul class="social_toolbox fleft">
	
	<?php
	$rss =  $data['bnk_sm_rss'];
	$email =  $data['bnk_sm_email'];
	$facebook =  $data['bnk_sm_facebook'];
	$flickr =  $data['bnk_sm_flickr'];
	$twitter =  $data['bnk_sm_twitter'];
	$vimeo =  $data['bnk_sm_vimeo'];
	$youtube =  $data['bnk_sm_youtube'];
	$gplus =  $data['bnk_sm_gplus'];

	if ( $rss != '') { 
		?><li><a href="<?php echo $rss; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/rss.png" alt="RSS icon" /> 
			</a></li><?php
	} else  { 
		?><li><a href="<?php bloginfo('rss2_url'); ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/rss.png" alt="RSS icon" /> 
			</a></li><?php
	}
	if ( $email != '') {
		?><li><a href="mailto:<?php echo $email; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/email.png" alt="Email icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}
	
	if ( $facebook != '') {
		?><li><a href="<?php echo $facebook; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/facebook.png" alt="Facebook icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}

	if ( $flickr != '') {
		?><li><a href="<?php echo $flickr; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/flickr.png" alt="Flickr icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}
		
	if ( $twitter != '') {
		?><li><a href="<?php echo $twitter; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/twitter.png" alt="Twitter icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}
	
	if ( $vimeo != '') {
		?><li><a href="<?php echo $vimeo; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/vimeo.png" alt="Vimeo icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}
	
	if ( $youtube != '') {
		?><li><a href="<?php echo $youtube; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/youtube.png" alt="Youtube icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}

	if ( $gplus != '') {
		?><li><a href="<?php echo $gplus; ?>" target="_blank">
			<img src="<?php echo get_template_directory_uri() ?>/img/icons/googleplus.png" alt="Google+ icon" /> 
			</a></li><?php
	} else {
		echo ''; //If no URL inputed
	}
?>
	</ul>