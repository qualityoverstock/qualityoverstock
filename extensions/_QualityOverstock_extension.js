/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var _QualityOverstock = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
			
				app.ext._QualityOverstock.a.showDescription();
					//app.u.dump("_QOS showDescription() run");
				app.ext._QualityOverstock.a.sansReviews();
					//app.u.dump("_QOS sansReviews() run");
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID)); //grabs the currently loaded product page (to ignore previously loaded / invisible ones)
					app.ext._QualityOverstock.a.runProductCarousel($context);
						app.u.dump('product Ran');
					app.ext._QualityOverstock.a.runProductCarouselReco($context);
						app.u.dump('Reco Ran');
					app.ext._QualityOverstock.a.runProductCarouselRecent($context);
						app.u.dump('Recent Ran');
					app.ext._QualityOverstock.a.runProductCarouselSimilar($context);
						app.u.dump('Similar Ran');
					app.ext._QualityOverstock.a.runProductCarouselTitle($context);
				}]);
					
				return true;
				/*var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;*/
			},
			onError : function() {
				app.u.dump('BEGIN app.ext._QualityOverstock.callbacks.init.onError');
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					if(app.ext.myRIA && app.ext.myRIA.template){
						app.u.dump("_QualityOverstock Extension Started");
					} else	{
						setTimeout(function(){app.ext._QualityOverstock.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext._QualityOverstock.callbacks.startExtension.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

				showReviews : function(pid) {
					var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
					
					app.u.dump('SHOW REVIEW');
				
					$('.prodSelectSeeReviewButton', $context).animate(1000);
					setTimeout(function() {
						$('.prodSummaryContainer', $context).hide();
						$('.prodReviewContainer', $context).show();
						$('.prodSelectSeeReviewButton', $context).hide();
						$('.prodSelectSeeDescriptionButton', $context).show();
						$('.prodSelectSeeDescriptionButton', $context).unbind();
						$('.prodSelectSeeDescriptionButton', $context).click(app.ext._QualityOverstock.a.showDescription);
					}, 250);
				}, //END showReviews
				showDescription : function(pid) {
					var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
					
					app.u.dump('SHOW DESC');
					
					$('.prodSelectSeeDescriptionButton', $context).animate(1000);
					setTimeout(function() {
						$('.prodReviewContainer', $context).hide();
						$('.prodSummaryContainer', $context).show();
						$('.prodSelectSeeDescriptionButton', $context).hide();
						$('.prodSelectSeeReviewButton', $context).show();
						$('.prodSelectSeeReviewButton', $context).unbind();
						$('.prodSelectSeeReviewButton', $context).click(app.ext._QualityOverstock.a.showReviews);
					}, 250);
				}, //END showDescription
				
				
				sansReviews : function() {
					app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) { 
					
						var $thisProduct = $('#productTemplate_'+app.u.makeSafeHTMLId(P.pid));
						app.u.dump("Begin review message displaying function");
						if($(".noReviews", $thisProduct).children().length === 0){
							app.u.dump("No reviews. Running existing message check");
							if(($(".reviewsCont", $thisProduct).length === 0) || ($(".reviewsCont", $thisProduct).length === null)){
							  app.u.dump("No message exists. Display message");
							  $('.beFirst', '#productTemplate_'+app.u.makeSafeHTMLId(P.pid)).append(
							  '<p style="text-align:center;" class="reviewsCont">'
							  + 'Be the First to Review This Product!'
							  + '</p>');
							  //var p = document.getElementsByClassName("reviewsCont");
							  //p.reviewsCont += '#productTemplate_'+app.u.makeSafeHTMLId(P.pid);
							  app.u.dump("Review message displaying for : " + '#productTemplate_'+app.u.makeSafeHTMLId(P.pid));
							}
							else{
								app.u.dump("Message exists. Doing nothing");
							}
					
					
							/*var noReviews = document.createElement("p");
							var noReviewsMessage = document.createTextNode("Be the First to Review This Product!");
							noReviews.appendChild(noreviewsMessage);
							var findReviewSec = document.getElementsByClassName("reviewsBind");
							document.body.insertBefore(noReviews, findReviewSec);*/
						}
						else
						{
							app.u.dump("Reviews exist. function aborted. Reviews length amount: " + $(".reviewsBind").children.length);
							
						}
					
					}]);
				},// END SANSREVIEWS
				
				runProductCarouselTitle : function($context) {
					//CAROUSEL OF CAROUSELS ON PRODUCT PAGE
					var $target = $('.productCarouselTitle', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							height: 50,
							width: 940,
							items: {
								visible: 3,
								minimum: 1,
								width: 313,
								height: 50,
							},
							synchronise: '.productCarousel',
							auto: false,
							prev: {
								button: '.productCarouselPrev',
								key: "left"
							},
							next: {
								button: '.productCarouselNext',
								key: "right"
							},
							//pagination: '.productCarouselTitle',
							scroll: 1,/*{
								items: 1,
								fx: 'crossfade',
								duration: 3000,
								timeoutDuration: 2000
							},*/
							swipe: {
								onMouse: true,
								onTouch: true
								}
							});
						},1500); 
					} //end prodPageCarousel
				},
				
				runProductCarousel : function($context) {
					//CAROUSEL OF CAROUSELS ON PRODUCT PAGE
					var $target = $('.productCarousel', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							height: 326,
							width: 960,
							items: {
								visible: 1,
								minimum: 1,
								width: 960,
								height: 326,
							},
							auto: false,
							prev: {
								button: '.productCarouselPrev',
								key: "left"
							},
							next: {
								button: '.productCarouselNext',
								key: "right"
							},
							//pagination: '.productCarouselTitle',
							scroll: 1,
							swipe: {
								onMouse: true,
								onTouch: true
								}
							});
						},1500); 
					} //end prodPageCarousel
				},
				
				runProductCarouselSimilar : function($context) {
					//SIMILAR ITEMS CAROUSEL ON PRODUCT PAGE
					var $target = $('.prodCarSimilar', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							height: 286,
							width: 960,
							items: {
								visible: 6,
								minimum: 1,
								width: 160,
								height: 286,
							},
							auto: false,
							prev: {
								button: '.prodCarouselSimilarPrev',
								key: "left"
							},
							next: {
								button: '.prodCarouselSimilarNext',
								key: "right"
							},
							pagination: '.prodCarSimPagination',
							scroll: 6,
							swipe: {
								onMouse: true,
								onTouch: true
								}
							});
						},2000); 
					} //end prodPageCarouselSimilar
				},
				
				runProductCarouselRecent : function($context) {
					//RECENT ITEMS CAROUSEL ON PRODUCT PAGE
					var $target = $('.prodCarRecent', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							height: 286,
							width: 960,
							items: {
								visible: 6,
								minimum: 1,
								width: 160,
								height: 286,
							},
							auto: false,
							prev: {
								button: '.prodCarouselRecentPrev',
								key: "left"
							},
							next: {
								button: '.prodCarouselRecentNext',
								key: "right"
							},
							pagination: '.prodCarRecentPagination',
							scroll: 6,
							swipe: {
								onMouse: true,
								onTouch: true
								}
							});
						},2000); 
					} //end prodPageCarouselRecent
				},
				
				runProductCarouselReco : function($context) {
					//RECOMMENDED ITEMS CAROUSEL ON PRODUCT PAGE
					var $target = $('.prodCarReco', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							height: 286,
							width: 960,
							items: {
								visible: 6,
								minimum: 1,
								width: 160,
								height: 286,
							},
							auto: false,
							prev: {
								button: '.prodCarouselRecoPrev',
								key: "left"
							},
							next: {
								button: '.prodCarouselRecoNext',
								key: "right"
							},
							pagination: '.prodCarRecoPagination',
							scroll: 6,
							swipe: {
								onMouse: true,
								onTouch: true
								}
							});
						},2000); 
					} //end prodPageCarouselReco
				}
				
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
				
				youSaved : function($tag, data) {
					app.u.dump(data.value);
				/*
					var ourPrice = data.value['%attribs']['zoovy:base_price'];
					var discPrice = data.value['%attribs']['zoovy:prod_vendor_price'];
					var retailPrice = data.value['%attribs']['zoovy:zoovy:prod_msrp'];
					
					app.u.dump('*** ' + ourPrice + '*** ' + discPrice + '*** ' + retailPrice);
				*/
				}
				
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
				
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}