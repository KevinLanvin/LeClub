// Preview of the courses schedule in the CMS + "download as image" button.
// The markup/CSS mirror `src/components/Courses.astro` (desktop version, 1440px wide) and add the
// club logo on top, so the exported image makes sense once shared outside the site.
// Keep the colors / course names in sync with `Courses.astro` and `src/content/config.ts`.
/* global CMS, h, createClass, htmlToImage */

var CANVAS_WIDTH = 1440

var COURSE_COLOR = {
  '2 - 4 mois': 'green',
  '4 - 6 mois': 'green',
  '6 mois et +': 'green',
  Rééducation: 'blue',
  Intermédiaire: 'orange',
  'Tous niveaux': 'green',
  CSAU: 'red',
  Secrétariat: 'neutral',
}

var FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Jomolhari&family=Poppins:wght@400;700&display=swap'

// html-to-image does not reliably embed Google Fonts (the export falls back to Arial), so the
// @font-face rules are fetched once and their files inlined as data URIs.
var fontCssPromise = null
function loadFontCss() {
  if (!fontCssPromise) {
    fontCssPromise = fetch(FONTS_URL)
      .then(function (response) {
        return response.text()
      })
      .then(function (css) {
        var urls = css.match(/https:\/\/[^)'"\s]+/g) || []
        return Promise.all(
          urls.map(function (url) {
            return fetch(url)
              .then(function (response) {
                return response.blob()
              })
              .then(function (blob) {
                return new Promise(function (resolve) {
                  var reader = new FileReader()
                  reader.onloadend = function () {
                    resolve([url, reader.result])
                  }
                  reader.readAsDataURL(blob)
                })
              })
          }),
        ).then(function (files) {
          files.forEach(function (file) {
            css = css.split(file[0]).join(file[1])
          })
          return css
        })
      })
      .catch(function (error) {
        fontCssPromise = null
        throw error
      })
  }
  return fontCssPromise
}

var CSS = [
  '.pe-viewport{width:100%;overflow:hidden;border:1px solid #ddd;border-radius:8px}',
  '.pe-toolbar{display:flex;align-items:center;gap:12px;margin-bottom:12px;font-family:Poppins,sans-serif;font-size:14px}',
  '.pe-toolbar button{padding:10px 18px;border:0;border-radius:8px;background:#e3733f;color:#fff;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer}',
  '.pe-toolbar button[disabled]{opacity:.6;cursor:wait}',
  '.pe-canvas{transform-origin:top left}',
  '.pe-canvas,.pe-canvas *{box-sizing:border-box;margin:0}',
  '.pe-courses{width:' + CANVAS_WIDTH + 'px;background-color:#d6e8d0;color:#3e4945;font-family:Poppins,sans-serif;font-size:16px;line-height:normal;display:flex;flex-direction:column;align-items:center;gap:2.5rem;padding-block:5rem;position:relative;overflow:hidden}',
  '.pe-courses>*{position:relative;z-index:1}',
  '.pe-courses>.pe-logo{position:absolute;z-index:0;width:90rem;aspect-ratio:calc(884/430);background-color:#224f3c;opacity:.12;-webkit-mask:url(/images/logo-no-text.svg) center/contain no-repeat;mask:url(/images/logo-no-text.svg) center/contain no-repeat}',
  '.pe-courses>.pe-logo-right{top:-10%;right:-55rem;transform:rotate(-30deg)}',
  '.pe-courses>.pe-logo-left{bottom:-20%;left:-60rem;transform:rotate(20deg)}',
  '.pe-club-logo{display:block;height:8rem;width:auto}',
  '.pe-title{display:flex;gap:1rem}',
  '.pe-title h2{text-align:center;font-family:Jomolhari,serif;font-size:3rem;line-height:3rem;font-weight:400}',
  '.pe-planning{padding:1.5rem;border-radius:24px;background-color:#fff;text-align:center;width:calc(' + CANVAS_WIDTH + 'px - 10rem)}',
  '.pe-planning tbody>tr:nth-child(2n){background-color:#fff3dd}',
  '.pe-planning tbody>tr:nth-child(2n+1){background-color:#fffaf1}',
  '.pe-planning td,.pe-planning th{border:2px solid #fff;padding-block:1rem;padding-inline:.5rem}',
  '.pe-planning th:last-child{text-align:left}',
  '.pe-planning .date{text-transform:capitalize;background-color:#fff3dd}',
  '.pe-planning .course-name{display:block;margin:auto;padding:.25rem 1rem;border-radius:24px;background-color:#fff;font-weight:bold;width:fit-content}',
  '.pe-planning .green{background-color:#d6e8d0}',
  '.pe-planning .orange{background-color:#fcf0eb}',
  '.pe-planning .red{background-color:#ffe6dc}',
  '.pe-planning .blue{background-color:#c7e4f2}',
  '.pe-planning .neutral{background-color:#f0ffdc}',
  '.pe-planning .monitors{text-align:left}',
].join('\n')

// displayed names: keep in sync with `teacherNames` in `Courses.astro`
var TEACHER_NAMES = {
  anthony: 'Anthony',
  badis: 'Badis',
  christophe: 'Christophe',
  dominique: 'Dominique',
  fred: 'Fred',
  guillaume: 'Guillaume',
  kevin: 'Kevin',
  laurent: 'Laurent',
  lena: 'Léna',
  marie: 'Marie-Christine',
  nathalie: 'Nathalie',
  patrick: 'Patrick',
  sandrine: 'Sandrine',
  valerie: 'Valérie',
  yohann: 'Yohann',
  martineC: 'Martine C',
  martineD: 'Martine D',
}

function teacherName(value) {
  return TEACHER_NAMES[value] || String(value || '')
}

function formatDate(value) {
  var date = new Date(value)
  if (isNaN(date.getTime())) return String(value || '')
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

function sortedDays(entry) {
  var days = entry.getIn(['data', 'days'])
  days = days && days.toJS ? days.toJS() : []
  return days.slice().sort(function (a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}

function buildRows(days) {
  var rows = []
  days.forEach(function (day, dayIndex) {
    var courses = day.courses || []
    courses.forEach(function (course, index) {
      var cells = []
      if (index === 0) {
        cells.push(
          h('td', { key: 'date', className: 'date', rowSpan: courses.length }, formatDate(day.date)),
        )
      }
      cells.push(h('td', { key: 'hour' }, course.hour_interval))
      cells.push(
        h(
          'td',
          { key: 'course' },
          h(
            'span',
            { className: 'course-name ' + (COURSE_COLOR[course.courseName] || '') },
            course.courseName,
          ),
        ),
      )
      cells.push(
        h(
          'td',
          { key: 'monitors', className: 'monitors' },
          h('span', null, (course.teachers || []).map(teacherName).join(' & ')),
        ),
      )
      rows.push(h('tr', { key: dayIndex + '-' + index }, cells))
    })
  })
  return rows
}

var PlanningPreview = createClass({
  getInitialState: function () {
    return { scale: 1, height: 0, exporting: false, error: null }
  },

  componentDidMount: function () {
    var self = this
    this.resizeObserver = new ResizeObserver(function () {
      self.updateScale()
    })
    if (this.viewport) this.resizeObserver.observe(this.viewport)
    if (this.canvas) this.resizeObserver.observe(this.canvas)
    this.updateScale()
  },

  componentWillUnmount: function () {
    if (this.resizeObserver) this.resizeObserver.disconnect()
  },

  // the 1440px canvas is scaled down to fit the width of the preview pane
  updateScale: function () {
    if (!this.viewport || !this.canvas) return
    var scale = this.viewport.clientWidth / CANVAS_WIDTH
    var height = Math.round(this.canvas.offsetHeight * scale)
    if (Math.abs(scale - this.state.scale) > 0.001 || height !== this.state.height) {
      this.setState({ scale: scale, height: height })
    }
  },

  exportImage: function () {
    var self = this
    var node = this.canvas
    if (!node || this.state.exporting) return
    this.setState({ exporting: true, error: null })
    loadFontCss()
      .then(function (fontEmbedCSS) {
        var options = {
          width: CANVAS_WIDTH,
          height: node.offsetHeight,
          pixelRatio: 2,
          fontEmbedCSS: fontEmbedCSS,
          style: { transform: 'none' }, // export at full size, not at the preview scale
        }
        // first pass warms up images, the second one is the one we keep
        return htmlToImage.toPng(node, options).then(function () {
          return htmlToImage.toPng(node, options)
        })
      })
      .then(function (dataUrl) {
        var days = sortedDays(self.props.entry)
        var firstDate = days.length ? String(days[0].date).slice(0, 10) : 'planning'
        var link = document.createElement('a')
        link.download = 'planning-' + firstDate + '.png'
        link.href = dataUrl
        link.click()
        self.setState({ exporting: false })
      })
      .catch(function (error) {
        console.error(error)
        self.setState({ exporting: false, error: "L'export a échoué, réessayez." })
      })
  },

  render: function () {
    var self = this
    var days = sortedDays(this.props.entry)
    return h(
      'div',
      null,
      h('style', null, CSS),
      h(
        'div',
        { className: 'pe-toolbar' },
        h(
          'button',
          { type: 'button', onClick: this.exportImage, disabled: this.state.exporting },
          this.state.exporting ? 'Export en cours…' : "Télécharger en image (PNG)",
        ),
        this.state.error ? h('span', { style: { color: '#c00' } }, this.state.error) : null,
      ),
      h(
        'div',
        {
          className: 'pe-viewport',
          ref: function (el) {
            self.viewport = el
          },
          style: { height: this.state.height ? this.state.height + 'px' : 'auto' },
        },
        h(
          'div',
          {
            className: 'pe-canvas',
            ref: function (el) {
              self.canvas = el
            },
            style: { width: CANVAS_WIDTH + 'px', transform: 'scale(' + this.state.scale + ')' },
          },
          h(
            'section',
            { className: 'pe-courses' },
            h('div', { className: 'pe-logo pe-logo-right', 'aria-hidden': 'true' }),
            h('div', { className: 'pe-logo pe-logo-left', 'aria-hidden': 'true' }),
            h('img', {
              className: 'pe-club-logo',
              src: '/images/logo-club.svg',
              alt: 'Logo Le Club Téteghem',
            }),
            h(
              'div',
              { className: 'pe-title' },
              h('img', { src: '/icons/header-before.svg', alt: '' }),
              h('h2', null, 'Le planning des', h('br'), ' prochains cours'),
              h('img', { src: '/icons/header-after.svg', alt: '' }),
            ),
            h(
              'table',
              { className: 'pe-planning' },
              h(
                'thead',
                null,
                h(
                  'tr',
                  null,
                  h('th', null, 'Date'),
                  h('th', null, 'Horaire'),
                  h('th', null, 'Cours'),
                  h('th', null, 'Moniteurs'),
                ),
              ),
              h('tbody', null, buildRows(days)),
            ),
            h('p', null, 'Le planning est mis à jour chaque semaine en fonction des moniteurs disponibles.'),
            h('p', null, '137 Route de Furnes, 59229 Téteghem-Coudekerque-Village'),
          ),
        ),
      ),
    )
  },
})

CMS.registerPreviewStyle(FONTS_URL)
// the file's `name` in config.yml (file collection)
CMS.registerPreviewTemplate('courses', PlanningPreview)
