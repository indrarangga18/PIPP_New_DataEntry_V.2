import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Heading } from '@ckeditor/ckeditor5-heading'

import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles'

import { Alignment } from '@ckeditor/ckeditor5-alignment'
import { FontFamily, FontSize } from '@ckeditor/ckeditor5-font'

import { Link } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { Indent } from '@ckeditor/ckeditor5-indent'

import { Table, TableToolbar } from '@ckeditor/ckeditor5-table'

import { Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle } from '@ckeditor/ckeditor5-image'

import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format'

// Style dropdown is premium; skip to keep offline OSS build

export default class CustomEditor extends ClassicEditor {}

CustomEditor.builtinPlugins = [
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Alignment,
  FontFamily,
  FontSize,
  Link,
  List,
  Indent,
  Table,
  TableToolbar,
  Image,
  ImageUpload,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  HorizontalLine,
  RemoveFormat,
]

CustomEditor.defaultConfig = {
  toolbar: {
    items: [
      'undo', 'redo', '|',
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
      'fontFamily', 'fontSize', 'style', '|',
      'bulletedList', 'numberedList', 'outdent', 'indent', '|',
      'alignment', '|',
      'link', 'insertTable', 'imageUpload', 'horizontalLine', '|',
      'removeFormat'
    ]
  },
  language: 'en',
}