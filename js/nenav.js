/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 2016 - Davide Francesco Merico <hds619 at gmail dot com>
 */

var nenav_instance = [];
var load_instance = '<div class="nenav-load"><div></div></div>';

function nenav_css_workaround () {
	
	for ( var ref_id in nenav_instance ) {
		  for ( var len = $(ref_id + ' .nenav-head td').length; len; len-- )
				$(ref_id + ' .nenav-head td:nth-child(' + len + ')').width (
					$(ref_id + ' .nenav-table td:nth-child(' + len + ')').width ()
				);
	}
}

function nenav_init (ref_id, param) {
	nenav_instance[ref_id] = {
		                       init_path: param.init_path,
		                        curr_pos: param.curr_pos || null,
							        sort: param.sort || 'name',
							    php_path: param.php_path || 'php',
							     ui_path: param.ui_path || 'html'
		                     };
	
	$(ref_id).html (load_instance);	                     
                     
    $.get (nenav_instance[ref_id].ui_path + '/nenav-ui.html', function (result) {
		   $(ref_id).append (result);
		   
		   $(ref_id + ' .nenav-path').append (nenav_do_path (nenav_instance[ref_id]));
		   
		   $(ref_id + ' .nenav-load').hide ();
		   $(ref_id + ' .nenav-main').show ();
		   
		   
		   $(ref_id + ' .nenav-view').append (load_instance);
		   
		   var post_path = nenav_instance[ref_id].init_path + '/';
	
		   if ( nenav_instance[ref_id].curr_pos )
			    post_path += nenav_instance[ref_id].curr_pos;
			    
		   $.getJSON (nenav_instance[ref_id].php_path + '/nenav.php', 
		              { scandir: post_path }, function (result) {
				$(ref_id + ' .nenav-table tbody').append (
				  nenav_do_view (ref_id, result, nenav_instance[ref_id].sort)
				);
				
				$(ref_id + ' .nenav-foot td').append (
				  nenav_do_stats (result)
				);
				
				$(ref_id + ' .nenav-head button').click (function (event) {
					nenav_change_sort (ref_id, event);
				});
				
				$(ref_id + ' .nenav-table tr').click (function (event) {
					nenav_click_path (ref_id, event);
				});
				
				$(ref_id + ' .nenav-path button').click (function (event) { 
					nenav_change_path (ref_id, 
					                   $(ref_id + ' .nenav-path button').index (this));
				});
				
				$(ref_id + ' .nenav-view .nenav-load').remove ();
				$(ref_id + ' .nenav-table').show ();
				nenav_css_workaround ();				
		   });
	});
	$(window).resize (nenav_css_workaround);
}

function nenav_do_path (instance) {
	var return_var = '<button>root</button>';
    
	if ( !instance.curr_pos )
	     return return_var;
	     
	var list_path = instance.curr_pos.split ('/');
	
	for ( var elem in list_path ) 
		  return_var += '<button>' + list_path[elem] + '</button>';
		              
	return return_var;
}

function nenav_do_view (ref_id, result, sort_type) {
	var string = "";
    var refer = ref_id + ' .nenav-internal-' + sort_type.split ('-')[0];
    
	switch (sort_type) {
		case 'name':
			 result['file'].sort (sort_by_name);
			 break;
		case 'name-reverse':
		     result['file'].sort (sort_by_name_inv);
		     break;
		case 'time':
			 result['file'].sort (sort_by_time);
			 break;
		case 'time-reverse':
		     result['file'].sort (sort_by_time_inv);
		     break;
		case 'size':
			 result['file'].sort (sort_by_size);
			 break;
		case 'size-reverse':
		     result['file'].sort (sort_by_size_inv);
		     break;
	}
	              
	if ( sort_type.indexOf ('reverse') != -1 ) 
		 $(refer + ' .nenav-arrow-up').css('display', 'inline-block');
	else $(refer + ' .nenav-arrow-down').css('display', 'inline-block');
	      
	$(refer).addClass ('nenav-btn-current');
		 
	for ( var __elem in result['file'] ) {
		  var elem = result['file'][__elem];
		  var size = elem['is_dir'] ? "" : nenav_format_size (elem['size']);
		  var icon = elem['is_dir'] ? 'nenav-icon-folder' : 'nenav-icon-file';
		  
		  string += '<tr>'
		          + '<td><span class="nenav-icon ' + icon + '"></span>' 
		          + elem['name'] + '</td>'
		          + '<td>' + size + '</td>'
		          + '<td>' + elem['time'] + '</td>'
		          + '</tr>';
	}
	
	return string;
}

function sort_by_name (elem1, elem2) {
	if ( elem1['is_dir'] == elem2['is_dir'] ) 
		 return elem1['name'].toLowerCase ().localeCompare (
		          elem2['name'].toLowerCase ()
		        );
	
	return ( elem1['is_dir'] && !elem2['is_dir'] ) ? -1 : 1;
}

function sort_by_name_inv (elem1, elem2) {
	if ( elem1['is_dir'] == elem2['is_dir'] ) 
		 return elem1['name'].toLowerCase ().localeCompare (
		          elem2['name'].toLowerCase ()
		        ) * -1;
	
	return ( elem1['is_dir'] && !elem2['is_dir'] ) ? -1 : 1;
}

function sort_by_time (elem1, elem2) {
	return elem1['time'].localeCompare (elem2['time']);
}

function sort_by_time_inv (elem1, elem2) {
	return sort_by_time (elem1, elem2) * -1;
}

function sort_by_size (elem1, elem2) {
	if ( !elem1['is_dir'] && !elem2['is_dir'] )
	     if ( elem1['size'] == elem2['size'] )
	          return elem1['name'].toLowerCase () === elem2['name'].toLowerCase ();
	     else return ( elem1['size'] < elem2['size'] ) ? -1 : 1;
	
	if ( elem1['is_dir'] && elem2['is_dir'] )
		 return elem1['name'].toLowerCase () === elem2['name'].toLowerCase ();
	
	return ( elem1['is_dir'] && !elem2['is_dir'] ) ? -1 : 1;	
}

function sort_by_size_inv (elem1, elem2) {
	if ( !elem1['is_dir'] && !elem2['is_dir'] )
	     if ( elem1['size'] == elem2['size'] )
	          return elem1['name'].toLowerCase () === elem2['name'].toLowerCase ();
	     else return ( elem1['size'] < elem2['size'] ) ? 1 : -1;
	
	if ( elem1['is_dir'] && elem2['is_dir'] )
		 return elem1['name'].toLowerCase () === elem2['name'].toLowerCase ();
	
	return ( elem1['is_dir'] && !elem2['is_dir'] ) ? -1 : 1;	
}

function nenav_format_size (bytes) {
	var sz = [ "B", "KB", "MB", "GB", "TB" ];
	var factor = Math.floor((bytes.toString ().length - 1) / 3);
	var value = bytes / Math.pow (1024, factor);
	
	return value.toFixed (2) + ' ' + sz[factor];
}

function nenav_change_sort (ref_id, event) {
	var btn_id = event.target.className.substring (25).split(' ')[0];
	
	$(ref_id + ' .nenav-head button').removeClass ('nenav-btn-current');
	$(ref_id + ' .nenav-head .nenav-arrow-up').hide ();
	$(ref_id + ' .nenav-head .nenav-arrow-down').hide ();
	
	if ( btn_id == nenav_instance[ref_id].sort.split ('-')[0] ) {
		 if ( nenav_instance[ref_id].sort.indexOf ('-') != -1 )
		      nenav_instance[ref_id].sort = btn_id;
		 else nenav_instance[ref_id].sort = btn_id + '-reverse';
	}
	else nenav_instance[ref_id].sort = btn_id;
	
	var new_pos = nenav_instance[ref_id].init_path;
	if ( nenav_instance[ref_id].curr_pos )
	     new_pos += '/' + nenav_instance[ref_id].curr_pos; 
	              
	nenav_get_and_do (ref_id, new_pos);
	                        
	$(ref_id + ' .nenav-view').show ();
}

function nenav_do_stats (result) {
	return result['stats']['folders'] + ' Folders, '
	     + result['stats']['files'] + ' Files - '
	     + nenav_format_size (result['stats']['size']);
}

function nenav_clean_view (ref_id) {
	$(ref_id + ' .nenav-file pre').empty ();
	$(ref_id + ' .prettyprint').removeClass ().addClass ('prettyprint linenums');
	
	$(ref_id + ' .nenav-file>div:nth-child(1)').empty ();
}

function nenav_reset_view (ref_id) {
  nenav_clean_view (ref_id);
  
  $(ref_id + ' .nenav-table tbody').empty ();
  $(ref_id + ' .nenav-foot td').empty ();
  $(ref_id + ' .nenav-path').empty ();
  
  $(ref_id + ' .nenav-head .nenav-arrow-up').hide ();
  $(ref_id + ' .nenav-head .nenav-arrow-down').hide ();
  $(ref_id + ' .nenav-file').hide ();
  
  $(ref_id + ' .nenav-head button').removeClass ('nenav-btn-current');  
}

function nenav_click_path (ref_id, event) {
	var is_dir = !event.currentTarget.childNodes[1].innerText;
	var filename = event.currentTarget.childNodes[0].innerText;
	var location = nenav_instance[ref_id].init_path;
	
	if ( nenav_instance[ref_id].curr_pos )
	     location += '/' + nenav_instance[ref_id].curr_pos;
	     
	if ( is_dir ) {
		 var ip = nenav_instance[ref_id].init_path;
		 var cp = null;
		 
		 if ( nenav_instance[ref_id].curr_pos ) {
		      cp = nenav_instance[ref_id].curr_pos.split ('/');
		      cp.push (filename);
		      cp = cp.join('/');
		 }
		 else cp = filename;
		 
         nenav_instance[ref_id].curr_pos = cp;
		 nenav_get_and_do (ref_id, ip + '/' + cp);
		 
         $(ref_id + ' .nenav-view').show ();
	}
	else {
		  nenav_clean_view (ref_id);
		  
		  $(ref_id + ' .nenav-view').hide ();
		  $(ref_id + ' .nenav-file').show ();
		  $(ref_id + ' .nenav-file').append (load_instance);
		  
		  $.getJSON (nenav_instance[ref_id].php_path + '/nenav.php', 
		             { get_file: location + '/' + filename },
		             function (result) {
						var file_ext = filename.split ('.').reverse ()[0].toLowerCase ();
						
						$(ref_id + ' .nenav-file>div:nth-child(1)').append (
						  '<b>File:</b> ' + filename  +
						  ' - <b>Size:</b> ' + nenav_format_size (result['size']) 
						);
						
					    $(ref_id + ' .nenav-file pre').html (result['data']);
						$(ref_id + ' .nenav-file .nenav-load').remove ();
					    $(ref_id + ' .prettyprint').addClass('lang-' + file_ext);
					    
					    prettyPrint ();
					    nenav_css_workaround ();			
				     }
		  );
	}
}

function nenav_get_and_do (ref_id, new_pos) {	                  
  nenav_reset_view (ref_id);
  $(ref_id + ' .nenav-view').append (load_instance);
  $(ref_id + ' .nenav-path').append (nenav_do_path (nenav_instance[ref_id]));
  
  $.getJSON (nenav_instance[ref_id].php_path + '/nenav.php', { scandir: new_pos }, function (result) {
	$(ref_id + ' .nenav-table tbody').append (
	  nenav_do_view (ref_id, result, nenav_instance[ref_id].sort)
	);
				
	$(ref_id + ' .nenav-foot td').append (
	  nenav_do_stats (result)
	);
				
	$(ref_id + ' .nenav-table tr').click (function (event) {
		nenav_click_path (ref_id, event);
	});
				
	$(ref_id + ' .nenav-path button').click (function (event) { 
		nenav_change_path (ref_id, $(ref_id + ' .nenav-path button').index (this));
	});
				
	$(ref_id + ' .nenav-view .nenav-load').remove ();
	
	nenav_css_workaround ();			
  });
}

function nenav_change_path (ref_id, request_id) {
  var ip = nenav_instance[ref_id].init_path;
  var cp = null;
  var new_pos = ip;
  
  if ( nenav_instance[ref_id].curr_pos ) {
       cp = nenav_instance[ref_id].curr_pos.split ('/').slice (0, request_id).join ('/');
       new_pos += '/' + cp; 
  }
    
  nenav_instance[ref_id].curr_pos = cp;
  nenav_get_and_do (ref_id, new_pos);
  
  $(ref_id + ' .nenav-view').show ();
}
