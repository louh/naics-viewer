import React, { Component } from 'react'
import { Link } from 'react-router'
import './App.css'
import Search from './Search'
import YearSelector from './YearSelector'
import Record from './Record'

const DEFAULT_YEAR = 2012

class App extends Component {
  constructor (props) {
    super(props)

    const initialState = this.getStateFromProps(props)

    this.state = {
      year: initialState.year,
      code: initialState.code,
      searchTerms: initialState.terms,
      recordTitle: null
    }

    this.setPageTitle = this.setPageTitle.bind(this)
    this.selectYear = this.selectYear.bind(this)
    this.setSearchTerms = this.setSearchTerms.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  componentDidUpdate () {
    this.setPageTitle()
    // this.context.router.transitionTo(`?year=${this.props.year}&code=${this.props.code}`)
  }

  getStateFromProps (props) {
    let year = DEFAULT_YEAR
    if (props.location && props.location.query && props.location.query.year) {
      year = Number(props.location.query.year)
    }

    let code = null
    if (props.location && props.location.query && props.location.query.code) {
      code = String(props.location.query.code)
    }

    let terms = null
    if (props.location && props.location.query && props.location.query.terms) {
      terms = String(props.location.query.terms)
    }

    return {
      year,
      code,
      terms
    }
  }

  setPageTitle () {
    if (this.state.code && this.state.year && this.state.recordTitle) {
      document.title = `${this.state.code} ${this.state.recordTitle} – ${this.state.year} NAICS Browser`
    } else {
      document.title = 'NAICS Browser'
    }
  }

  selectYear (year) {
    this.setState({ year })
  }

  setSearchTerms (terms) {
    this.setState({ searchTerms: terms })

    // Once set, we update the URL query string here. It doesn't get updated
    // via react-router because it doesn't activate through clicking a <Link>.
    // Apparently there is also a react-router API for transitioning URLs, but
    // it resulted in weird (seemingly infinite loop) behavior the one time I tried.
    let params = new window.URLSearchParams(window.location.search)
    if (terms) {
      params.set('terms', terms)
    } else {
      params.delete('terms')
    }

    window.history.replaceState({}, '', '/?' + params);
  }

  renderRightColumn () {
    if (this.state.year && this.state.code) {
      return <Record year={this.state.year} code={this.state.code} />
    } else {
      const query = { year: 2012, code: '519120' }
      if (this.state.searchTerms) {
        query.terms = this.state.searchTerms
      }

      return (
        <div id="frontpage">
          <div className="crumbs">
            Introduction
          </div>

          <p>
            This is an alternative to the NAICS website hosted by the <a href="https://www.census.gov/eos/www/naics/index.html">US Census Bureau</a>. It uses <a href="http://naics.codeforamerica.org/">Code for America’s NAICS API</a> to provide a more user-friendly interface. The code is <a href="https://www.github.com/louh/naics-browser">open source</a>.
          </p>

          <p>
            For a sample NAICS code,
            {' '}<Link to={{ query }}>
              take a look at this one.
            </Link>
          </p>

          <YearSelector year={this.state.year} selectYear={this.selectYear} />
        </div>
      )
    }
  }

  render () {
    return (
      <div role="main" className="viewport">
        <div className="left-column">
          <h1><Link to={{query: {}}}>NAICS Browser</Link></h1>
          <Search year={this.state.year} terms={this.state.searchTerms} setSearchTerms={this.setSearchTerms} />
        </div>
        <div className="right-column">
          {this.renderRightColumn()}
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}

App.propTypes = {
  location: React.PropTypes.object
}

export default App;
