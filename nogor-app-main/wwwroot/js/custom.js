$(document).ready(function () {
	$(".loader").fadeOut(500);

	$(".login-panel").slideUp(500);
});

jQuery(document).ready(function ($) {
	
	/* Menu */
	
	jQuery(".navigation  ul li ul").parent("li").addClass("parent-list");
	jQuery(".parent-list").find("a:first").append(" <span class='menu-nav-arrow'><i class='icon-angle-down'></i></span>");
	
	jQuery(".navigation ul a").removeAttr("title");
	jQuery(".navigation ul ul").css({display: "none"});
	jQuery(".navigation ul li").each(function() {	
		var sub_menu = jQuery(this).find("ul:first");
		jQuery(this).hover(function() {	
			sub_menu.stop().css({overflow:"hidden", height:"auto", display:"none", paddingTop:0}).slideDown(250, function() {
				jQuery(this).css({overflow:"visible", height:"auto"});
			});	
		},function() {	
			sub_menu.stop().slideUp(250, function() {	
				jQuery(this).css({overflow:"hidden", display:"none"});
			});
		});	
	});
	
	/* Header fixed */
	
	var aboveHeight   = jQuery("#header").outerHeight();
	var fixed_enabled = jQuery("#wrap").hasClass("fixed-enabled");
	if(fixed_enabled){
		jQuery(window).scroll(function(){
			if(jQuery(window).scrollTop() > aboveHeight ){
				jQuery("#header").css({"top":"0"}).addClass("fixed-nav");
			}else{
				jQuery("#header").css({"top":"auto"}).removeClass("fixed-nav");
			}
		});
	}else {
		jQuery("#header").removeClass("fixed-nav");
	}
	
	/* Header and footer fix mobile */
	
	jQuery(window).bind("resize", function () {
		if (jQuery(this).width() > 990) {
			jQuery(".navigation_mobile_main").addClass("navigation");
			jQuery(".navigation").removeClass("navigation_mobile");
			jQuery(".navigation").find(".navigation_mobile_click").remove();
		}else {
			jQuery(".navigation").addClass("navigation_mobile");
			jQuery(".navigation").addClass("navigation_mobile_main");
			jQuery(".navigation_mobile").removeClass("navigation");
			jQuery(".navigation_mobile").each(function () {
				if (!jQuery(this).find(".navigation_mobile_click").length) {
					jQuery(this).prepend("<div class='navigation_mobile_click'>Go to...</div>");
				}
			});
		}
		if (jQuery(this).width() < 465) {
			jQuery(".social_icons").each(function () {
				if (jQuery(this).find("li").length > 10) {
					jQuery(this).find("li i").addClass("font11");
					jQuery(this).find("li i").removeClass("font17");
				}
			});
		}else {
			jQuery(".social_icons").each(function () {
				if (jQuery(this).find("li").length > 10) {
					jQuery(this).find("li i").addClass("font17");
					jQuery(this).find("li i").removeClass("font11");
				}
			});
		}
		
		if (jQuery(this).width() < 767) {
			jQuery(".panel-pop").each(function () {
				var panel_pop = jQuery(this);
				var panel_width = panel_pop.outerWidth();
				panel_pop.css("margin-left","-"+panel_width/2+"px");
			});
		}
	});
	
	if (jQuery(this).width() < 767) {
		jQuery(".panel-pop").each(function () {
			var panel_pop = jQuery(this);
			var panel_width = panel_pop.outerWidth();
			panel_pop.css("margin-left","-"+panel_width/2+"px");
		});
	}
	
	if (jQuery(window).width() < 465) {
		jQuery(".social_icons").each(function () {
			if (jQuery(this).find("li").length > 10) {
				jQuery(this).find("li i").addClass("font11");
				jQuery(this).find("li i").removeClass("font17");
			}
		});
	}else {
		jQuery(".social_icons").each(function () {
			if (jQuery(this).find("li").length > 10) {
				jQuery(this).find("li i").addClass("font17");
				jQuery(this).find("li i").removeClass("font11");
			}
		});
	}
	
	if (jQuery(window).width() > 990) {
		jQuery(".navigation_mobile_main").addClass("navigation");
		jQuery(".navigation").removeClass("navigation_mobile");
		jQuery(".navigation").find(".navigation_mobile_click").remove();
	}else {
		jQuery(".navigation").addClass("navigation_mobile");
		jQuery(".navigation").addClass("navigation_mobile_main");
		jQuery(".navigation_mobile").removeClass("navigation");
		jQuery(".navigation_mobile").each(function () {
			if (!jQuery(this).find(".navigation_mobile_click").length) {
				jQuery(this).prepend("<div class='navigation_mobile_click'>Go to...</div>");
			}
		});
	}
	
	if (jQuery(".navigation_mobile_click").length) {
		jQuery(".navigation_mobile_click").click(function() {
			if (jQuery(this).hasClass("navigation_mobile_click_close")) {
				jQuery(this).next().slideUp(500);
				jQuery(this).removeClass("navigation_mobile_click_close");
			}else {
				jQuery(this).next().slideDown(500);
				jQuery(this).addClass("navigation_mobile_click_close");
			}
		});
	}
	
	/* Go up */
	
	jQuery(window).scroll(function () {
		if(jQuery(this).scrollTop() > 100 ) {
			jQuery(".go-up").css("right","20px");
		}else {
			jQuery(".go-up").css("right","-60px");
		}
	});
	jQuery(".go-up").click(function(){
		jQuery("html,body").animate({scrollTop:0},500);
		return false;
	});
	
	/* Icon boxes */
		
	jQuery(".box_warp").each(function () {
		var box_warp = jQuery(this);
		var box_background = box_warp.attr("box_background");
		var box_color = box_warp.attr("box_color");
		var box_border = box_warp.attr("box_border");
		var box_border_width = box_warp.attr("box_border_width");
		var box_border_radius = box_warp.attr("box_border_radius");
		var box_background_hover = box_warp.attr("box_background_hover");
		var box_color_hover = box_warp.attr("box_color_hover");
		var box_border_hover = box_warp.attr("box_border_hover");
		
		box_warp.css({"background-color":box_background,"border-color":box_border,"color":box_color,"-moz-border-radius":box_border_radius+"px","-webkit-border-radius":box_border_radius+"px","border-radius":box_border_radius+"px"});
		
		if (box_border_width != "") {
			box_warp.css("border",box_border_width+"px solid "+box_border);
		}
		
		box_warp.find("a").not(".button").css({"color":box_color});
		
		box_warp.hover(function () {
			box_warp.css({"background-color":box_background_hover,"border-color":box_border_hover,"color":box_color_hover});
			box_warp.find("a").not(".button").css({"color":box_color_hover});
		},function () {
			box_warp.css({"background-color":box_background,"border-color":box_border,"color":box_color});
			box_warp.find("a").not(".button").css({"color":box_color});
		});
	});
	
	jQuery(".box_icon").each(function () {
		var box_icon = jQuery(this);
		var icon_align = box_icon.find(".icon_i > span").attr("icon_align");
		var icon_size = box_icon.find(".icon_i > span").attr("icon_size");
		
		if (box_icon.find(".icon_i > span").hasClass("icon_soft_r") || box_icon.find(".icon_i > span").hasClass("icon_square") || box_icon.find(".icon_i > span").hasClass("icon_circle")) {
			box_icon.find(".icon_i > span").css({"height":icon_size+"px","width":icon_size+"px","font-size":icon_size/2+"px","line-height":icon_size+"px"});
			box_icon.find(".icon_i > span > span").css({"margin":0,"text-align":"center"}).parent().css({"line-height":icon_size+"px"});
		}else if (box_icon.find(".box_text h3 > span").hasClass("icon_soft_r") || box_icon.find(".box_text h3 > span").hasClass("icon_square") || box_icon.find(".box_text h3 > span").hasClass("icon_circle")) {
			if (icon_size > 80 && box_icon.find(".box_text h3 > span > span").length == 1) {
				var icon_size = 80;
			}
			box_icon.find(".box_text h3 > span").css({"height":icon_size+"px","width":icon_size+"px","line-height":icon_size+"px"});
		}else {
			box_icon.find(".icon_i > span i").css({"font-size":icon_size/2+"px"});
		}
		
		if (icon_align == "left") {
			box_icon.find(".icon_i").css({"display":"inherit"});
			if (box_icon.find(".icon_i > span").hasClass("icon_soft_r") || box_icon.find(".icon_i > span").hasClass("icon_square") || box_icon.find(".icon_i > span").hasClass("icon_circle")) {
				box_icon.find(".box_text").css({"padding-left":parseFloat(icon_size)+25+"px"});
			}else if (box_icon.find(".icon_i span[class^='icons']").length == 1) {
				box_icon.find(".box_text").css({"padding-left":41+"px"});
			}else {
				box_icon.find(".box_text").css({"padding-left":parseFloat(icon_size/2)+15+"px"});
			}
			
			box_icon.find(".icon_i > span").addClass("f_left");
		}else if (icon_align == "right") {
			box_icon.find(".icon_i").css({"display":"inherit"});
			
			if (box_icon.find(".icon_i > span").hasClass("icon_soft_r") || box_icon.find(".icon_i > span").hasClass("icon_square") || box_icon.find(".icon_i > span").hasClass("icon_circle")) {
				box_icon.find(".box_text").css({"padding-right":parseFloat(icon_size)+25+"px"});
			}else if (box_icon.find(".icon_i span[class^='icons']").length == 1) {
				box_icon.find(".box_text").css({"padding-right":41+"px"});
			}else {
				box_icon.find(".box_text").css({"padding-right":parseFloat(icon_size/2)+15+"px"});
			}
			
			box_icon.find(".icon_i > span").addClass("f_right");
		}else if (icon_align == "center") {
			box_icon.find(".icon_i").addClass("t_center");
		}
	});

	jQuery(".box_icon").each(function() {
		var this_icon = jQuery(this);
		var span_bg = this_icon.find(".icon_i > span").attr("span_bg");
		if (span_bg != undefined) {
			this_icon.find(".icon_i > span").css({"background-color":span_bg});
		}else {
			var span_bg = this_icon.find(".box_text h3 > span").attr("span_bg");
			this_icon.find(".box_text h3 > span").css({"background-color":span_bg});
		}
		var i_color = this_icon.find(".icon_i > span i").attr("i_color");
		if (i_color != undefined) {
			this_icon.find(".icon_i > span i").css({"color":i_color});
		}
		var border_radius = this_icon.find(".icon_i > span").attr("border_radius");
		if (border_radius != undefined) {
			this_icon.find(".icon_i > span").css({"-moz-border-radius":border_radius+"px","-webkit-border-radius":border_radius+"px","border-radius":border_radius+"px"});
		}
		
		var border_color = this_icon.find(".icon_i > span").attr("border_color");
		if (border_color != undefined) {
			this_icon.find(".icon_i > span").css({"border-color":border_color});
			this_icon.find(".box_text h3 > span").css({"border-color":border_color});
		}else {
			var border_color = this_icon.find(".box_text h3 > span").attr("border_color");
			this_icon.find(".box_text h3 > span").css({"border-color":border_color});
		}
		var border_width = this_icon.find(".icon_i > span").attr("border_width");
		if (border_width != undefined) {
			this_icon.find(".icon_i > span").css({"border-width":border_width+"px","border-style":"solid"});
		}else {
			var border_width = this_icon.find(".box_text h3 > span").attr("border_width");
			this_icon.find(".box_text h3 > span").css({"border-width":border_width+"px","border-style":"solid"});
		}
	
		this_icon.hover(function () {
			var span_hover = this_icon.find(".icon_i > span").attr("span_hover");
			if (span_hover != undefined) {
				this_icon.find(".icon_i > span").css({"background-color":span_hover});
			}else {
				var span_hover = this_icon.find(".box_text h3 > span").attr("span_hover");
				this_icon.find(".box_text h3 > span").css({"background-color":span_hover});
			}
			var border_hover = this_icon.find(".icon_i > span").attr("border_hover");
			if (border_hover != undefined) {
				this_icon.find(".icon_i > span").css({"border-color":border_hover});
			}else {
				var border_hover = this_icon.find(".box_text h3 > span").attr("border_hover");
				this_icon.find(".box_text h3 > span").css({"border-color":border_hover});
			}
			var i_hover = this_icon.find(".icon_i > span i").attr("i_hover");
			if (i_hover != undefined) {
				this_icon.find(".icon_i > span i").css({"color":i_hover});
			}
			
			if (this_icon.find(".button").length) {
				var button_background_hover = this_icon.find(".button").attr("button_background_hover");
				var button_color_hover = this_icon.find(".button").attr("button_color_hover");
				var button_border_hover = this_icon.find(".button").attr("button_border_hover");
				this_icon.find(".button").css({"background-color":button_background_hover,"color":button_color_hover,"border-color":button_border_hover});
			}
		},function() {
			if (i_color != undefined) {
				this_icon.find(".icon_i > span i").css({"color":i_color});
			}
			var span_bg = this_icon.find(".icon_i > span").attr("span_bg");
			if (span_bg != undefined) {
				this_icon.find(".icon_i > span").css({"background-color":span_bg});
			}else {
				var span_bg = this_icon.find(".box_text h3 > span").attr("span_bg");
				this_icon.find(".box_text h3 > span").css({"background-color":span_bg});
			}
			var border_color = this_icon.find(".icon_i > span").attr("border_color");
			if (border_color != undefined) {
				this_icon.find(".icon_i > span").css({"border-color":border_color});
			}else {
				var border_color = this_icon.find(".box_text h3 > span").attr("border_color");
				this_icon.find(".box_text h3 > span").css({"border-color":border_color});
			}
			if (this_icon.find(".button").length) {
				var button_background = this_icon.find(".button").attr("button_background");
				var button_color = this_icon.find(".button").attr("button_color");
				var button_border = this_icon.find(".button").attr("button_border");
				this_icon.find(".button").css({"background-color":button_background,"color":button_color,"border-color":button_border});
			}
		});
		
	});
	
	/* Icons */
	
	jQuery(".icon_i").each(function() {
		var this_icon = jQuery(this);
		if (!this_icon.parent().hasClass("box_icon") && !this_icon.parent().parent().hasClass("box_icon") && !this_icon.parent().parent().parent().hasClass("box_icon")) {
			var span_bg = this_icon.find("> span").attr("span_bg");
			var icon_align = this_icon.find("> span").attr("icon_align");
			var icon_size = this_icon.find("> span").attr("icon_size");
			var border_color = this_icon.find("> span").attr("border_color");
			var border_width = this_icon.find("> span").attr("border_width");
			var border_radius = this_icon.find("> span").attr("border_radius");
			var span_hover = this_icon.find("> span").attr("span_hover");
			var border_hover = this_icon.find("> span").attr("border_hover");
			var i_color = this_icon.find("> span i").attr("i_color");
			var i_hover = this_icon.find("> span i").attr("i_hover");
			
			if (this_icon.find("> span").hasClass("icon_soft_r") || this_icon.find("> span").hasClass("icon_square") || this_icon.find("> span").hasClass("icon_circle")) {
				this_icon.find("> span").css({"height":icon_size+"px","width":icon_size+"px","font-size":icon_size/2+"px","line-height":icon_size+"px"});
				this_icon.find("> span > span").css({"margin":0,"text-align":"center"});
			}else {
				this_icon.find("> span i").css({"font-size":icon_size/2+"px"});
			}
			
			if (icon_align == "left") {
				this_icon.addClass("f_left");
			}else if (icon_align == "right") {
				this_icon.addClass("f_right");
			}else if (icon_align == "center") {
				this_icon.addClass("t_center");
				this_icon.css("margin-bottom","15px");
			}
			
			if (this_icon.find("> span").hasClass("icon_soft_r") || this_icon.find("> span").hasClass("icon_square") || this_icon.find("> span").hasClass("icon_circle")) {
				this_icon.find("> span").css({"background-color":span_bg,"border-color":border_color,"border-width":border_width+"px","border-style":"solid","-moz-border-radius":border_radius+"px","-webkit-border-radius":border_radius+"px","border-radius":border_radius+"px"});
			}
			this_icon.find("> span i").css({"color":i_color});
		
			this_icon.hover(function () {
				if (this_icon.find("> span").hasClass("icon_soft_r") || this_icon.find("> span").hasClass("icon_square") || this_icon.find("> span").hasClass("icon_circle")) {
					this_icon.find("> span").css({"background-color":span_hover,"border-color":border_hover});
				}
				this_icon.find("> span i").css({"color":i_hover});
		
			},function() {
				if (this_icon.find("> span").hasClass("icon_soft_r") || this_icon.find("> span").hasClass("icon_square") || this_icon.find("> span").hasClass("icon_circle")) {
					this_icon.find("> span").css({"background-color":span_bg,"border-color":border_color});
				}
				this_icon.find("> span i").css({"color":i_color});
			});
		}
	});
	
	/* Section */
	
	jQuery(".section-warp").each(function () {
		var section = jQuery(this);
		var section_background_color = section.attr("section_background_color");
		var section_background = section.attr("section_background");
		var section_background_size = section.attr("section_background_size");
		var section_color = section.attr("section_color");
		var section_color_a = section.attr("section_color_a");
		var section_padding_top = section.attr("section_padding_top");
		var section_padding_bottom = section.attr("section_padding_bottom");
		var section_margin_top = section.attr("section_margin_top");
		var section_margin_bottom = section.attr("section_margin_bottom");
		var section_border_top = section.attr("section_border_top");
		var section_border_bottom = section.attr("section_border_bottom");
		
		if (section_background != "" && section_background != undefined) {
			section.css({"background-image":"url("+section_background+")"});
		}

		section.css({"background-size":section_background_size,"background-color":section_background_color,"color":section_color,"padding-top":section_padding_top+"px","padding-bottom":section_padding_bottom+"px","margin-top":section_margin_top+"px","margin-bottom":section_margin_bottom+"px"});
		section.find("h1").css({"color":section_color});
		section.find("h2").css({"color":section_color});
		section.find("h3").css({"color":section_color});
		section.find("h4").css({"color":section_color});
		section.find("h5").css({"color":section_color});
		section.find("h6").css({"color":section_color});
		section.find("p").css({"color":section_color});
		section.find("a").not(".button").css({"color":section_color_a});
		if (section_border_top != "") {
			section.css({"border-top":"1px solid "+section_border_top});
		}
		if (section_border_bottom != "") {
			section.css({"border-bottom":"1px solid "+section_border_bottom});
		}
	});
	
	jQuery(".accordion .accordion-title").each(function(){
		//i_color
		var i_color = jQuery(this).parent().attr("i_color");
		jQuery(this).parent().find(".accordion-title i").css({"color":i_color});
		//i_click
		var i_click = jQuery(this).parent().attr("i_click");
		jQuery(this).parent().find(".accordion-title.active i").css({"color":i_click});
	
		jQuery(this).click(function() {
			if (jQuery(this).parent().hasClass("toggle-accordion")) {
				jQuery(this).parent().find("li:first .accordion-title").addClass("active");
				jQuery(this).toggleClass("active");
				jQuery(this).next(".accordion-inner").slideToggle();
			}else {
				if (jQuery(this).next().is(":hidden")) {
					jQuery(this).parent().find(".accordion-title").removeClass("active").next().slideUp(200);
					jQuery(this).toggleClass("active").next().slideDown(200);
				}
			}
			if (jQuery(this).parent().hasClass("acc-style-4")) {
				jQuery(this).parent().find(".accordion-title.active").next().css({"border-bottom":"1px solid #DEDEDE"});
			}
			//i_color
			jQuery(this).parent().find(".accordion-title i").css({"color":i_color});
			//i_click
			jQuery(this).parent().find(".accordion-title.active i").css({"color":i_click});
			return false;
		});
	
	});
	
	/* Button */
	
	jQuery(".button").each(function () {
		var button = jQuery(this);
		var button_background = button.attr("button_background");
		var button_background_hover = button.attr("button_background_hover");
		var button_color = button.attr("button_color");
		var button_color_hover = button.attr("button_color_hover");
		var button_border = button.attr("button_border");
		var button_border_hover = button.attr("button_border_hover");
		var button_border_width = button.attr("button_border_width");
		var button_border_radius = button.attr("button_border_radius");
		
		button.css({"background-color":button_background,"color":button_color,"border":button_border_width+"px solid "+button_border,"-moz-border-radius":button_border_radius+"px","-webkit-border-radius":button_border_radius+"px","border-radius":button_border_radius+"px"});
		
		button.hover(function () {
		button.css({"background-color":button_background_hover,"color":button_color_hover,"border-color":button_border_hover});
		},function () {
			button.css({"background-color":button_background,"color":button_color,"border":button_border_width+"px solid "+button_border,"-moz-border-radius":button_border_radius+"px","-webkit-border-radius":button_border_radius+"px","border-radius":button_border_radius+"px"});
		});
	});
	
	/* Lists */
	
	jQuery(".ul_list").each(function () {
		var ul_list = jQuery(this);
		var list_background = ul_list.attr("list_background");
		var list_background_hover = ul_list.attr("list_background_hover");
		var list_color = ul_list.attr("list_color");
		var list_color_hover = ul_list.attr("list_color_hover");
		var list_border_radius = ul_list.attr("list_border_radius");

		if (ul_list.hasClass("ul_list_circle") || ul_list.hasClass("ul_list_square")) {
			ul_list.find("ul li i").css({"background-color":list_background,"-moz-border-radius":list_border_radius+"px","-webkit-border-radius":list_border_radius+"px","border-radius":list_border_radius+"px"});
			ul_list.find("ul li").hover(function () {
				jQuery(this).find("i").css({"background-color":list_background_hover});
			},function () {
				jQuery(this).find("i").css({"background-color":list_background});
			});
		}
		ul_list.find("ul li i").css({"color":list_color});

		ul_list.find("ul li").hover(function () {
			jQuery(this).find("i").css({"color":list_color_hover});
		},function () {
			jQuery(this).find("i").css({"color":list_color});
		});
		ul_list.find("i").each(function () {
			var ul_l = jQuery(this);
			var l_background = ul_l.attr("l_background");
			var l_background_hover = ul_l.attr("l_background_hover");
			var l_color = ul_l.attr("l_color");
			var l_color_hover = ul_l.attr("l_color_hover");
			var l_border_radius = ul_l.attr("l_border_radius");
			
			if (ul_l.hasClass("ul_l_circle") || ul_l.hasClass("ul_l_square")) {
				ul_l.css({"background-color":l_background,"-moz-border-radius":l_border_radius+"px","-webkit-border-radius":l_border_radius+"px","border-radius":l_border_radius+"px"});
				ul_l.parent().hover(function () {
					ul_l.css({"background-color":l_background_hover});
				},function () {
					ul_l.css({"background-color":l_background});
				});
			}
			
			ul_l.css({"color":l_color});
	
			ul_l.parent().hover(function () {
				ul_l.css({"color":l_color_hover});
			},function () {
				ul_l.css({"color":l_color});
			});
		});
	});
	
	
	/* Divider */
	
	jQuery(".divider").each(function () {
		var divider = jQuery(this);
		var divider_color = divider.attr("divider_color");
		
		divider.css({"border-bottom-color":divider_color});
	});
	
	
	/* Login panel */
	
	jQuery("#login-panel").click(function () {
		if (jQuery(this).hasClass("header-top-active")) {
			jQuery(".login-panel").slideUp(500);
			jQuery(this).removeClass("header-top-active");
			jQuery(this).find("i").addClass("icon-user");
			jQuery(this).find("i").removeClass("icon-remove");
		}else {
			jQuery(".login-panel").slideDown(500);
			jQuery(this).addClass("header-top-active");
			jQuery(this).find("i").removeClass("icon-user");
			jQuery(this).find("i").addClass("icon-remove");
		}
		return false;
	});
	
});