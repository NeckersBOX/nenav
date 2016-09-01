<?
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
 
  $nenav_prefix = '../../';
  
  if ( isset ($_GET) ) {
	   if ( isset ($_GET['scandir']) ) {		    
		    $rpath = $nenav_prefix.implode ('/', array_diff (explode ('/', $_GET['scandir']), array ("", '.', '..')));
			$json_data = array ( 'file' => null, 'stats' => array ( 'folders' => 0, 'files' => 0, 'size' => 0 ));
			
		    if ( !file_exists ($rpath) ) {
		         echo json_encode ($json_data);
		         return;
		    }
		         
			$read = array_diff (scandir ($rpath), array ('.', '..'));
			
			foreach ( $read as $file ) {
				$is_dir = is_dir ($rpath.'/'.$file);
				$fsize  = $is_dir ? 0 : filesize ($rpath.'/'.$file);
				
				if ( $is_dir )
				     $mtime = filemtime ($rpath.'/'.$file.'/.');
				else $mtime = filemtime ($rpath.'/'.$file);
				
				$json_data['file'][] = array ( 'name'   => $file,
											   'is_dir' => $is_dir,
										       'size'   => $fsize,
										       'time'   => date ('d-m-Y H:i', $mtime) );
										     
			    $json_data['stats'][$is_dir ? 'folders' : 'files']++;
			    $json_data['stats']['size'] += $fsize;
			}
			
			$json_data['stats']['size'] = $json_data['stats']['size'];
			
			echo json_encode ($json_data);
	   }
	   
	   if ( isset ($_GET['get_file']) ) {
		    $rpath = $nenav_prefix.implode ('/', array_diff (explode ('/', $_GET['get_file']), array ("", '.', '..')));
		    
		    if ( !file_exists ($rpath) ) {
				 echo json_encode (array ('data' => "", 'size' => 0));
				 return;
			}
			
			$file_data = file_get_contents ($rpath);
			$json_data = array ( 'data' => htmlspecialchars ($file_data),
			                     'size' => filesize ($rpath) );
			
			echo json_encode ($json_data);
	   }
  }
?>
