<?
/*
 +-------------------------------------------------------------------+
 |                       S E C - C O D E   (v1.3)                    |
 |                                                                   |
 | Copyright Gerd Tentler               www.gerd-tentler.de/tools    |
 | Created: Sep. 28, 2006               Last modified: Dez. 31, 2016 |
 +-------------------------------------------------------------------+
 | This program may be used and hosted free of charge by anyone for  |
 | personal purpose as long as this copyright notice remains intact. |
 |                                                                   |
 | Obtain permission before selling the code for this program or     |
 | hosting this software on a commercial website or redistributing   |
 | this software over the Internet or in any other medium. In all    |
 | cases copyright must remain intact.                               |
 +-------------------------------------------------------------------+
*/
  error_reporting(E_WARNING);
  if(function_exists('session_start')) session_start();

  header('Cache-control: private, no-cache, must-revalidate');
  header('Expires: 0');

//========================================================================================================
// Configuration
//========================================================================================================

  $name = "seccode";          // session variable name
  $fontSize = 5;              // font size (1 - 5)
  $fontColor = "444444";      // font color (RGB hexcode)
  $bgColor = "FFFFFF";        // background color (RGB hexcode)
  $lineColor = "FFFFFF";      // line color (RGB hexcode)

//========================================================================================================
// Functions
//========================================================================================================

  function convertRGB($color) {
    $color = preg_replace('/[^0-9a-f]/i', '', $color);
    return array(hexdec(substr($color, 0, 2)), hexdec(substr($color, 2, 2)), hexdec(substr($color, 4, 2)));
  }

  function createImage($text, $width, $height, $font = 5) {
    global $fontColor, $bgColor, $lineColor;

    if($img = @ImageCreate($width, $height)) {
      list($R, $G, $B) = convertRGB($fontColor);
      $fontColor = ImageColorAllocate($img, $R, $G, $B);
      list($R, $G, $B) = convertRGB($bgColor);
      $bgColor = ImageColorAllocate($img, $R, $G, $B);
      list($R, $G, $B) = convertRGB($lineColor);
      $lineColor = ImageColorAllocate($img, $R, $G, $B);
      ImageFill($img, 0, 0, $bgColor);

      for($i = 0; $i <= $width; $i += 5) {
        @ImageLine($img, $i, 0, $i, $height, $lineColor);
      }
      for($i = 0; $i <= $height; $i += 5) {
        @ImageLine($img, 0, $i, $width, $i, $lineColor);
      }

      $hcenter = $width / 2;
      $vcenter = $height / 2;
      $x = round($hcenter - ImageFontWidth($font) * strlen($text) / 2);
      $y = round($vcenter - ImageFontHeight($font) / 2);
      ImageString($img, $font, $x, $y, $text, $fontColor);

      if(function_exists('ImagePNG')) {
        header('Content-Type: image/png');
        @ImagePNG($img);
      }
      else if(function_exists('ImageGIF')) {
        header('Content-Type: image/gif');
        @ImageGIF($img);
      }
      else if(function_exists('ImageJPEG')) {
        header('Content-Type: image/jpeg');
        @ImageJPEG($img);
      }
      ImageDestroy($img);
    }
  }

//========================================================================================================
// Main
//========================================================================================================

  srand((double) microtime() * 1000000);
  $secCode = '';

  for($i = 0; $i < 6; $i++) $secCode .= rand(0, 9);
  $_SESSION[$name] = $secCode;

  createImage($secCode, 85, 19, $fontSize);
?>
