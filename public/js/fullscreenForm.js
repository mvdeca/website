( function( window ) {
	
	'use strict';
	var count;
	var IDs;
	$(document).ready(function(){
		count = 0;
		IDs = [];
		//$("#fs-form-wrap").find("input").each(function(){ IDs.push(this.id); });
		var everyID = document.querySelectorAll("#fs-form-wrap input");
		//console.log(everyID);
		for (var i = 0; i<everyID.length; i++) {
		    var id = String(everyID[i].id);
		    IDs.push(id);
		}
		console.log(IDs);
	});
	
	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

	/**
	 * extend obj function
	 */
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * createElement function
	 * creates an element with tag = tag, className = opt.cName, innerHTML = opt.inner and appends it to opt.appendTo
	 */
	function createElement( tag, opt ) {
		var el = document.createElement( tag )
		if( opt ) {
			if( opt.cName ) {
				el.className = opt.cName;
			}
			if( opt.inner ) {
				el.innerHTML = opt.inner;
			}
			if( opt.appendTo ) {
				opt.appendTo.appendChild( el );
			}
		}	
		return el;
	}

	/**
	 * FForm function
	 */
	function FForm( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	/**
	 * FForm options
	 */
	FForm.prototype.options = {
		// show progress bar
		ctrlProgress : true,
		// show navigation dots
		ctrlNavDots : true,
		// show [current field]/[total fields] status
		ctrlNavPosition : true,
		// reached the review and submit step
		//onReview : function() { return false; }
	};

	/**
	 * init function
	 * initialize and cache some vars
	 */
	FForm.prototype._init = function() {
		// the form element
		this.formEl = this.el.querySelector( 'form' );

		// list of fields
		this.fieldsList = this.formEl.querySelector( 'ol.fs-fields' );

		// current field position
		this.current = 0;

		// all fields
		this.fields = [].slice.call( this.fieldsList.children );
		
		// total fields
		this.fieldsCount = this.fields.length;
		
		// show first field
		classie.add( this.fields[ this.current ], 'fs-current' );

		// create/add controls
		this._addControls();

		// create/add messages
		this._addErrorMsg();
		
		// init events
		this._initEvents();
	};

	/**
	 * addControls function
	 * create and insert the structure for the controls
	 */
	FForm.prototype._addControls = function() {
		// main controls wrapper
		this.ctrls = createElement( 'div', { cName : 'fs-controls', appendTo : this.el } );

		// continue button (jump to next field)
		this.ctrlContinue = createElement( 'button', { cName : 'fs-continue', inner : 'Continue', appendTo : this.ctrls } );
		this.ctrlContinue.style.right = "65px";
		this._showCtrl( this.ctrlContinue );

		// navigation dots
		if( this.options.ctrlNavDots ) {
			this.ctrlNav = createElement( 'nav', { cName : 'fs-nav-dots', appendTo : this.ctrls } );
			var dots = '';
			for( var i = 0; i < this.fieldsCount; ++i ) {
				dots += i === this.current ? '<button class="fs-dot-current" style="height:12px;width:12px"></button>' : '<button disabled style="height:12px;width:12px"></button>';
			}
			this.ctrlNav.innerHTML = dots;
			//DOTS STYLE
			//this.ctrlNav.style.width = "10px";
			//this.ctrlNav.style.height = "100%";
			this._showCtrl( this.ctrlNav );
			this.ctrlNavDots = [].slice.call( this.ctrlNav.children );
		}

		// field number status
		if( this.options.ctrlNavPosition ) {
			this.ctrlFldStatus = createElement( 'span', { cName : 'fs-numbers', appendTo : this.ctrls } );
			this.ctrlFldStatus.style.right = "5%";
			this.ctrlFldStatus.style.width = "78px";

			// current field placeholder
			this.ctrlFldStatusCurr = createElement( 'span', { cName : 'fs-number-current', inner : Number( this.current + 1 ) } );
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusCurr );

			// total fields placeholder
			this.ctrlFldStatusTotal = createElement( 'span', { cName : 'fs-number-total', inner : this.fieldsCount } );
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusTotal );
			this._showCtrl( this.ctrlFldStatus );
		}

		// progress bar
		if( this.options.ctrlProgress ) {
			this.ctrlProgress = createElement( 'div', { cName : 'fs-progress', appendTo : this.ctrls } );
			this._showCtrl( this.ctrlProgress );
		}
	}

	/**
	 * addErrorMsg function
	 * create and insert the structure for the error message
	 */
	FForm.prototype._addErrorMsg = function() {
		// error message
		this.msgError = createElement( 'span', { cName : 'fs-message-error', appendTo : this.el } );
	}

	/**
	 * init events
	 */
	FForm.prototype._initEvents = function() {
		var self = this;

		// show next field
		this.ctrlContinue.addEventListener( 'click', function(ev) {
			var validator = $("#myform").validate({
				        rules: 
				        {
				          field:
				          {
				          	required: true,
				          },
				          sid:
				          {
				            maxlength: 7,
				            digits: true,
				          },
				          cnum:
				          {
				          	maxlength: 10,
				            digits: true,
				          },
				          hp:
				          {
				          	maxlength: 10,
				            digits: true,
				          },
				          gday:
				          {
				            digits: true,
				          },
				          zcode:
				          {
				          	maxlength: 5,
				            digits: true,				            
				          },
				          message:
				          {
				            rangelength:[50,1050]
				          },
				        },
				        errorPlacement: function(error, element) 
				        {
				        	//console.log(element.is(":radio"));
				            if(element.attr("type") == "radio") 
				            {
								error.insertBefore(element);				            }
				            else 
				            { // This is the default behavior 
				                error.insertAfter(element);
				            }
				         }
				      });
					var isValid = validator.element(document.getElementById(IDs[count]));
				   //console.log(!($(this).valid()));
				   //console.log($(':focus'));
				   //console.log(!isValid);
				    if(!(isValid))
				    {
				        $(document.getElementById(IDs[count])).focus();
				        //return false;
				    }	
				    else
				    {
				    	if(count != (IDs.length-1))
				    	{
					    	//console.log(document.getElementById(IDs[count]).getAttribute("type") == "radio")
					    	if(document.getElementById(IDs[count]).getAttribute("type") == "radio")
					    	{
					    		if((document.getElementById(IDs[count]).getAttribute("name") == "gender"))
					    		{
					    			count+=3; //skips the other radio buttons that were saved as IDs
					    		}
					    		else if((document.getElementById(IDs[count]).getAttribute("name") == "text") || (document.getElementById(IDs[count]).getAttribute("name") == "udate") || (document.getElementById(IDs[count]).getAttribute("name") == "stat"))
					    		{
					    			count+=2; //skips the other radio buttons that were saved as IDs
					    		}
					    		else if((document.getElementById(IDs[count]).getAttribute("name") == "shirt") || (document.getElementById(IDs[count]).getAttribute("name") == "r"))
					    		{
					    			count+=4; //skips the other radio buttons that were saved as IDs
					    		}

					    	}
					    	else
					    	{
					    		count+= 1;
					    	}
					    	console.log(IDs[count]);				
							ev.preventDefault();
							validator.resetForm();
							self._nextField();
						}
						else
						{
							var first = document.forms["myForm"]["fname"].value;
						    //var usrname = document.forms["myForm"]["uname"].value;
						    var password = document.forms["myForm"]["pass"].value;
						    var last = document.forms["myForm"]["lname"].value;
						    var studentId = document.forms["myForm"]["sid"].value;
						    var email = document.forms["myForm"]["em"].value;
						    var gender = document.forms["myForm"]["gender"].value;
						    var theday = document.forms["myForm"]["bday"].value;
						    var grad = document.forms["myForm"]["gday"].value;
						    var status = document.forms["myForm"]["stat"].value;
						    var cell = document.forms["myForm"]["cnum"].value;
						    var texting = document.forms["myForm"]["text"].value;
						    var tshirt = document.forms["myForm"]["shirt"].value;
						    var pfirst = document.forms["myForm"]["pfn"].value;
						    var plast = document.forms["myForm"]["pln"].value;
						    var relation = document.forms["myForm"]["r"].value;
						    var pemail = document.forms["myForm"]["pm"].value;
						    var pphone = document.forms["myForm"]["hp"].value;
						    var pupdate = document.forms["myForm"]["udate"].value;
						    var address = document.forms["myForm"]["addr"].value;
						    var zip = document.forms["myForm"]["zcode"].value;
						    /*req.body.uname, req.body.pass, req.body.fname,
						     req.body.lname, req.body.sid, req.body.em, req.body.mf,
						      req.body.bday, req.body.gday, req.body.stat, req.body.cnum, 
						      req.body.text, req.body.shirt, req.body.pfn, req.body.pln,
						       req.body.r, req.body.pm, req.body.pp, req.body.udate, 
						       req.body.addr, req.body.zcode*/
						    //console.log("goes to end");

						    var data = {"fname": first, "pass": password, "lname": last, "sid":studentId, "em":email, "mf":gender, "bday":theday, "gday":grad,
							"stat":status, "cnum":cell, "text":texting, "shirt":tshirt, "pfn":pfirst, "pln":plast, "r":relation, "pm":pemail, "pp":pphone, "udate":pupdate, "addr":address, "zcode":zip};
							 //$.post("/register", data, function(response) { alert(response);}, 'json');
							 //window.location = "/";
							/* $.ajax({
							        url:'/register',
							        type:'post',
							        data:data,
							        success:function(){
							            window.location.href = "/";
							        }
							    });*/
							//ev.PreventDefault();
							 $.post("/register",
						    data,
						    function(data, status){
						        
						    });
							 //ev.PreventDefault();
							 setTimeout(function(){ 
							  	console.log("in call bac");
							  	
							   }, 20000000);
							  window.close();
							  	window.open("/");
							 console.log("GOT THROUGH post");
						}
					}
			//self._nextField(); 
		} );

		// navigation dots
		if( this.options.ctrlNavDots ) {
			this.ctrlNavDots.forEach( function( dot, pos ) {
				dot.addEventListener( 'click', function() {
					self._showField( pos );
					//console.log("COUNT BEFORE: "+count);
					//POS SET HERE
					count = 0;
					//console.log("COUNT BEFORE: "+count);
					var i = 0;
					var inc = pos;
					while(i < inc)
					{
						//console.log("INC:" +inc);
						/*if(IDs[i] == "bday")
						{
							console.log("in bday");
							count+= 1;
						}*/
						if(document.getElementById(IDs[i]).getAttribute("type") == "radio")
					    	{
					    		//console.log("in radio");
					    		if((document.getElementById(IDs[i]).getAttribute("name") == "gender"))
					    		{
					    			//console.log("in gender");
					    			count+=3; //skips the other radio buttons that were saved as IDs
					    			inc+=2;
					    			i+=2;
					    		}
					    		else if((document.getElementById(IDs[i]).getAttribute("name") == "text") || (document.getElementById(IDs[count]).getAttribute("name") == "udate") || (document.getElementById(IDs[count]).getAttribute("name") == "stat"))
					    		{
					    			count+=2; //skips the other radio buttons that were saved as IDs
					    			inc+=1;
					    			i+=1;
					    		}
					    		else if((document.getElementById(IDs[i]).getAttribute("name") == "shirt") || (document.getElementById(IDs[count]).getAttribute("name") == "r"))
					    		{
					    			count+=4; //skips the other radio buttons that were saved as IDs
					    			inc+=3;
					    			i+=3;
					    		}
					    	}
					    	else
					    	{
					    		count+= 1;
					    	}
					    	i += 1;
					}
					//count = pos;
					//console.log("POS: " + pos);
					//console.log("COUNT: "+ count);
					//$(document.getElementById(IDs[count])).focus();


				} );
			} );
		}

		// jump to next field without clicking the continue button (for fields/list items with the attribute "data-input-trigger")
		this.fields.forEach( function( fld ) {
			if( fld.hasAttribute( 'data-input-trigger' ) ) {
				var input = fld.querySelector( 'input[type="radio"]' ) || /*fld.querySelector( '.cs-select' ) ||*/ fld.querySelector( 'select' ); // assuming only radio and select elements (TODO: exclude multiple selects)
				if( !input ) return;

				switch( input.tagName.toLowerCase() ) {
					case 'select' : 
						input.addEventListener( 'change', function() { self._nextField(); } );
						break;

					/*case 'input' : 
						[].slice.call( fld.querySelectorAll( 'input[type="radio"]' ) ).forEach( function( inp ) {
							inp.addEventListener( 'change', function(ev) { self._nextField(); } );
						} ); 
						break;*/

					/*
					// for our custom select we would do something like:
					case 'div' : 
						[].slice.call( fld.querySelectorAll( 'ul > li' ) ).forEach( function( inp ) {
							inp.addEventListener( 'click', function(ev) { self._nextField(); } );
						} ); 
						break;
					*/
				}
			}
		} );

		// keyboard navigation events - jump to next field when pressing enter
		document.addEventListener( 'keydown', function( ev ) {
			if( !self.isLastStep && ev.target.tagName.toLowerCase() !== 'textarea') {
				var keyCode = ev.keyCode || ev.which;
				if( keyCode === 13 ) {
				//var $focused = $(':focus');
				//$(document.activeElement).on("click", function(){
				var validator = $("#myform").validate({
				        rules: 
				        {
				          field:
				          {
				          	required: true,
				          },
				          sid:
				          {
				            maxlength: 10,
				            digits: true,
				          },
				          cnum:
				          {
				          	maxlength: 10,
				            digits: true,
				          },
				          hp:
				          {
				          	maxlength: 10,
				            digits: true,
				          },
				          gday:
				          {
				            digits: true,
				          },
				          zcode:
				          {
				            maxlength: 5,
				            digits: true,
				          },
				          message:
				          {
				            rangelength:[50,1050]
				          },
				        },
				        errorPlacement: function(error, element) 
				        {
				        	//console.log(element.is(":radio"));
				            if(element.attr("type") == "radio") 
				            {
								error.insertBefore(element);
							}
				            else 
				            { // This is the default behavior 
				                error.insertAfter(element);
				            }
				        }
				      });
					var isValid = validator.element(document.getElementById(IDs[count]));
				   //console.log(!($(this).valid()));
				   //console.log($(':focus'));
				   //console.log(!isValid);
				    if(!(isValid))
				    {
				        $(document.getElementById(IDs[count])).focus();
				        //return false;
				    }	
				    else
				    {
				    	if(count != (IDs.length-1))
				    	{
					    	//console.log(document.getElementById(IDs[count]).getAttribute("type") == "radio")
					    	if(document.getElementById(IDs[count]).getAttribute("type") == "radio")
					    	{
					    		if((document.getElementById(IDs[count]).getAttribute("name") == "gender"))
					    		{
					    			count+=3; //skips the other radio buttons that were saved as IDs
					    		}
					    		else if((document.getElementById(IDs[count]).getAttribute("name") == "text") || (document.getElementById(IDs[count]).getAttribute("name") == "udate") || (document.getElementById(IDs[count]).getAttribute("name") == "stat"))
					    		{
					    			count+=2; //skips the other radio buttons that were saved as IDs
					    		}
					    		else if((document.getElementById(IDs[count]).getAttribute("name") == "shirt") || (document.getElementById(IDs[count]).getAttribute("name") == "r"))
					    		{
					    			count+=4; //skips the other radio buttons that were saved as IDs
					    		}
					    	}
					    	else
					    	{
					    		count+=1; 
					    	}
					    	console.log(IDs[count]);				
							ev.preventDefault();
							validator.resetForm();
							self._nextField();
						}
						else
						{
							var first = document.forms["myForm"]["fname"].value;
						    //var usrname = document.forms["myForm"]["uname"].value;
						    var password = document.forms["myForm"]["pass"].value;
						    var last = document.forms["myForm"]["lname"].value;
						    var studentId = document.forms["myForm"]["sid"].value;
						    var email = document.forms["myForm"]["em"].value;
						    var gender = document.forms["myForm"]["gender"].value;
						    var theday = document.forms["myForm"]["bday"].value;
						    var grad = document.forms["myForm"]["gday"].value;
						    var status = document.forms["myForm"]["stat"].value;
						    var cell = document.forms["myForm"]["cnum"].value;
						    var texting = document.forms["myForm"]["text"].value;
						    var tshirt = document.forms["myForm"]["shirt"].value;
						    var pfirst = document.forms["myForm"]["pfn"].value;
						    var plast = document.forms["myForm"]["pln"].value;
						    var relation = document.forms["myForm"]["r"].value;
						    var pemail = document.forms["myForm"]["pm"].value;
						    var pphone = document.forms["myForm"]["hp"].value;
						    var pupdate = document.forms["myForm"]["udate"].value;
						    var address = document.forms["myForm"]["addr"].value;
						    var zip = document.forms["myForm"]["zcode"].value;
						    /*req.body.uname, req.body.pass, req.body.fname,
						     req.body.lname, req.body.sid, req.body.em, req.body.mf,
						      req.body.bday, req.body.gday, req.body.stat, req.body.cnum, 
						      req.body.text, req.body.shirt, req.body.pfn, req.body.pln,
						       req.body.r, req.body.pm, req.body.pp, req.body.udate, 
						       req.body.addr, req.body.zcode*/
						    console.log("goes to end");
						    //console.log(usrname);
						    //console.log(req.body.uname);
						    var data = {"fname": first, "pass": password, "lname": last, "sid":studentId, "em":email, "mf":gender, "bday":theday, "gday":grad,
						"stat":status, "cnum":cell, "text":texting, "shirt":tshirt, "pfn":pfirst, "pln":plast, "r":relation, "pm":pemail, "pp":pphone, "udate":pupdate, "addr":address, "zcode":zip};
							//window.location = "/";
							 //$.post("/register", data, function(response) { alert(response);}, 'json');
							  //ev.PreventDefault();
							  $.post("/register",
						    data,
						    function(data, status){
						    	
						    });
							  //ev.PreventDefault();
							  setTimeout(function(){ 
							  	console.log("in call bac");
							  	
							   }, 20000000);
							  window.close();
							  	window.open("/");

							 console.log("GOT THROUGH post");
						}
					}
				}
			}
		});
	}
	/**
	 * nextField function
	 * jumps to the next field
	 */
	FForm.prototype._nextField = function( backto ) {
		if( this.isLastStep || !this._validade() || this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		// check if on last step
		this.isLastStep = this.current === this.fieldsCount - 1 && backto === undefined ? true : false;
		
		// clear any previous error messages
		this._clearError();

		// current field
		var currentFld = this.fields[ this.current ];

		// save the navigation direction
		this.navdir = backto !== undefined ? backto < this.current ? 'prev' : 'next' : 'next';

		// update current field
		this.current = backto !== undefined ? backto : this.current + 1;

		if( backto === undefined ) {
			// update progress bar (unless we navigate backwards)
			this._progress();

			// save farthest position so far
			this.farthest = this.current;
		}

		// add class "fs-display-next" or "fs-display-prev" to the list of fields
		classie.add( this.fieldsList, 'fs-display-' + this.navdir );

		// remove class "fs-current" from current field and add it to the next one
		// also add class "fs-show" to the next field and the class "fs-hide" to the current one
		classie.remove( currentFld, 'fs-current' );
		classie.add( currentFld, 'fs-hide' );
		
		if( !this.isLastStep ) {
			// update nav
			this._updateNav();

			// change the current field number/status
			this._updateFieldNumber();

			var nextField = this.fields[ this.current ];
			classie.add( nextField, 'fs-current' );
			classie.add( nextField, 'fs-show' );
		}

		// after animation ends remove added classes from fields
		var self = this,
			onEndAnimationFn = function( ev ) {
				if( support.animations ) {
					this.removeEventListener( animEndEventName, onEndAnimationFn );
				}
				
				classie.remove( self.fieldsList, 'fs-display-' + self.navdir );
				classie.remove( currentFld, 'fs-hide' );

				if( self.isLastStep ) {
					// show the complete form and hide the controls
					self._hideCtrl( self.ctrlNav );
					self._hideCtrl( self.ctrlProgress );
					self._hideCtrl( self.ctrlContinue );
					self._hideCtrl( self.ctrlFldStatus );
					// replace class fs-form-full with fs-form-overview
					//classie.remove( self.formEl, 'fs-form-full' );
					//classie.add( self.formEl, 'fs-form-overview' );
					//classie.add( self.formEl, 'fs-show' );
					// callback
					//self.options.onReview();
					
				    //window.location.href = "/";
				}
				else {
					classie.remove( nextField, 'fs-show' );
					
					if( self.options.ctrlNavPosition ) {
						self.ctrlFldStatusCurr.innerHTML = self.ctrlFldStatusNew.innerHTML;
						self.ctrlFldStatus.removeChild( self.ctrlFldStatusNew );
						classie.remove( self.ctrlFldStatus, 'fs-show-' + self.navdir );
					}
				}
				self.isAnimating = false;
				$(document.getElementById(IDs[count])).focus();
			};

		if( support.animations ) {
			if( this.navdir === 'next' ) {
				if( this.isLastStep ) {
					currentFld.querySelector( '.fs-anim-upper' ).addEventListener( animEndEventName, onEndAnimationFn );
				}
				else {
					nextField.querySelector( '.fs-anim-lower' ).addEventListener( animEndEventName, onEndAnimationFn );
				}
			}
			else {
				nextField.querySelector( '.fs-anim-upper' ).addEventListener( animEndEventName, onEndAnimationFn );
			}
		}
		else {
			onEndAnimationFn();

		}
		
	}

	/**
	 * showField function
	 * jumps to the field at position pos
	 */
	FForm.prototype._showField = function( pos ) {
		if( pos === this.current || pos < 0 || pos > this.fieldsCount - 1 ) {
			return false;
		}
		this._nextField( pos );

	}

	/**
	 * updateFieldNumber function
	 * changes the current field number
	 */
	FForm.prototype._updateFieldNumber = function() {
		if( this.options.ctrlNavPosition ) {
			// first, create next field number placeholder
			this.ctrlFldStatusNew = document.createElement( 'span' );
			this.ctrlFldStatusNew.className = 'fs-number-new';
			this.ctrlFldStatusNew.innerHTML = Number( this.current + 1 );
			
			// insert it in the DOM
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusNew );
			
			// add class "fs-show-next" or "fs-show-prev" depending on the navigation direction
			var self = this;
			setTimeout( function() {
				classie.add( self.ctrlFldStatus, self.navdir === 'next' ? 'fs-show-next' : 'fs-show-prev' );
			}, 25 );
		}
	}

	/**
	 * progress function
	 * updates the progress bar by setting its width
	 */
	FForm.prototype._progress = function() {
		if( this.options.ctrlProgress ) {
			this.ctrlProgress.style.width = this.current * ( 100 / this.fieldsCount ) + '%';
		}
	}

	/**
	 * updateNav function
	 * updates the navigation dots
	 NAVIGATION CIRCLES*/ 
	FForm.prototype._updateNav = function() {
		if( this.options.ctrlNavDots ) {
			classie.remove( this.ctrlNav.querySelector( 'button.fs-dot-current' ), 'fs-dot-current' );
			classie.add( this.ctrlNavDots[ this.current ], 'fs-dot-current' );
			this.ctrlNavDots[ this.current ].disabled = false;
		}
	}

	/**
	 * showCtrl function
	 * shows a control
	 */
	FForm.prototype._showCtrl = function( ctrl ) {
		classie.add( ctrl, 'fs-show' );
	}

	/**
	 * hideCtrl function
	 * hides a control
	 */
	FForm.prototype._hideCtrl = function( ctrl ) {
		classie.remove( ctrl, 'fs-show' );
	}

	// TODO: this is a very basic validation function. Only checks for required fields..
	FForm.prototype._validade = function() {
		var fld = this.fields[ this.current ],
			input = fld.querySelector( 'input[required]' ) || fld.querySelector( 'textarea[required]' ) || fld.querySelector( 'select[required]' ),
			error;

		if( !input ) return true;

		/*switch( input.tagName.toLowerCase() ) {
			case 'input' : 
				if( input.type === 'radio' || input.type === 'checkbox' ) {
					var checked = 0;
					[].slice.call( fld.querySelectorAll( 'input[type="' + input.type + '"]' ) ).forEach( function( inp ) {
						if( inp.checked ) {
							++checked;
						}
					} );
					if( !checked ) {
						error = 'NOVAL';
					}
				}
				else if( input.value === '' ) {
					error = 'NOVAL';
				}
				break;
			case 'select' : 
				// assuming here '' or '-1' only
				if( input.value === '' || input.value === '-1' ) {
					error = 'NOVAL';
				}
				break;
			case 'textarea' :
				if( input.value === '' ) {
					error = 'NOVAL';
				}
				break;
		}
		if( error != undefined ) {
			this._showError( error );
			return false;
		}*/

		return true;
	}

	// TODO
	FForm.prototype._showError = function( err ) {
		var message = '';
		switch( err ) {
			case 'NOVAL' : 
				message = 'Please fill the field before continuing';
				break;
			case 'INVALIDEMAIL' : 
				message = 'Please fill a valid email address';
				break;
			// ...
		};
		this.msgError.innerHTML = message;
		this._showCtrl( this.msgError );
	}

	// clears/hides the current error message
	FForm.prototype._clearError = function() {
		this._hideCtrl( this.msgError );
	}
	// add to global namespace
	window.FForm = FForm;
})(window);