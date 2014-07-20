<?php $url = get_permalink(); ?>
<div class="clicky">
	<div class="click-share">
    	<a href="https://twitter.com/share" class="twitter-share-button" data-lang="en" url="<?=$url?>">Tweet</a>
    </div>
    <div class="click-like">
        <div class="click-like-wrap">
            <div class="fb-like" data-href="<?=$url?>" data-send="false" data-layout="button_count" data-width="80" data-show-faces="false" data-font="verdana"></div>
        </div>
    </div>
    <div class="click-plus">
        <!-- Place this tag where you want the +1 button to render -->
        <g:plusone size="medium" href="<?=$url?>"></g:plusone>
    </div>
    <?php 
    	if(get_the_post_thumbnail(get_the_ID(),array(400,220))) {
			$image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'social' ); 
			$image = $image[0];
		} else 
		{
			$image = site_url('/wp-content/uploads/2013/03/logo.png');
		}
	?>
    <div class="click-pin">
    	<a href="http://pinterest.com/pin/create/button/?url=<?=$url?><?php if($image) echo "&media=".$image; $image = "";?>" class="pin-it-button" count-layout="horizontal"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>
    </div>
</div>
<div class="clear"></div>