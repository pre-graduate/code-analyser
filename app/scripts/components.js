
import { uploadFiles, chunks } from './common.js';
import { customStyles } from './constants.js';
import Modal from 'react-modal';
import React from 'react';

import toastr from 'toastr';

export class Nav extends React.Component {
  constructor() {
    super();
    this.state = { activeTab: 'home' };
  }

  onTabClick(tab) {
    if(this.props.onSelected) {
      this.props.onSelected(tab);
    }

    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Code Analyser
            </a>
          </div>
          <div>
            <ul className="nav navbar-nav navbar-left">
              <li className={this.state.activeTab == 'home' ? 'active': ''}>
                <a onClick={() => this.onTabClick('home')} href="#">Home</a>
              </li>
              <li className={this.state.activeTab == 'about' ? 'active': ''}>
                <a onClick={() => this.onTabClick('about')} href="#">How does it work?</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className={disableDownload ? 'invisible': ''}>
                <a href="code-analyser.zip" target='_blank'><span className="glyphicon glyphicon-collapse-down"> </span> Download</a>
              </li>
              <li>
                <a onClick={() => this.props.onShowFiles()} href="#"><span className="glyphicon glyphicon-file"> </span> Files</a>
              </li>
            </ul>
          </div>
        </nav>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class About extends React.Component {
  render() {
    return (
      <div className={this.props.show ? '' : 'invisible'}>
        <div className="row">
          <div className="col-md-12">
            <div className="jumbotron text-center">
              <h1>How does it work?</h1><hr />
              <p>The below diagram shows how the system works</p>
            </div>
          </div>
          <div className="col-md-12">
            <blockquote>
            First we upload your source files directly to our server. Once there, we will go through each file gathering the useful information. Once we have the information we need we delete the files off our servers (We don’t store it don’t worry server space is expensive I don’t want to be your personal backup system :P) then return them back to your browser so you can see the information we now have. At the moment our analysis is very basic however I plan to move forward and add more in-depth analysis features over time.
            </blockquote>
            <img className='img-responsive' src="img/image.png" />
          </div>
        </div>
      </div>
    )
  }
}

export class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      results: [],
      files: [],
      page: 0
    };
  }

  uploadFiles() {
    if(this.state.files.length > 0) {
      uploadFiles(this.state.files, response => {
        if(response != null) {
          toastr.success("Analysis Successfull!");
          this.setState({ results: response.analysis });
        } else {
          toastr.error("Analysis failed please try again later.");
        }
      });
    } else {
      toastr.error('Error you must add some files first!');
    }
  }

  showFiles() {
    this.setState({ isOpen: true, page: 0 });
  }

  closeModal() {
    this.setState({ isOpen: false, page: 0 });
  }

  newFile(newFiles) {
    const files = this.state.files;
    newFiles.forEach(file => {
      files.push(file);
    })

    this.setState({ files }, () => {
      toastr.info(`Added ${files.length} files!`);
    });
  }

  nextPage(fileChunks) {
    if(this.state.page+1 < fileChunks.length) {
      this.setState({ page: ++this.state.page });
    }
  }

  prevPage(fileChunks) {
    if(this.state.page - 1 >= 0) {
      this.setState({ page: --this.state.page });
    }
  }

  removeFile(index) {
    const files = this.state.files;
    files.splice(index, 1);
    this.setState({ files });
  }

  render() {
    const fileChunks = chunks(this.state.files.slice(0), 5) || [];
    const files = fileChunks[this.state.page] || [];

    return (
      <div className={this.props.show ? '' : 'invisible'}>
        <Modal onRequestClose={() => this.closeModal()} isOpen={this.state.isOpen} style={customStyles}>
          <h1> Files <a onClick={() => this.closeModal()} className="close blue">x</a></h1><hr/>
          {
            (files.length === 0 ) ?
            <p>You havent added any files yet.</p> :
            <ul className="list-group">
            {
              files.map((file, index) => {
                return(
                  <li key={file.name + index} className="list-group-item">
                    <span className='badge'>{(file.size / 1000).toFixed(2)} kb</span>
                    <a onClick={() => this.removeFile(index)} href='#'>
                      <span className="glyphicon-list-group glyphicon-remove"> </span>
                    </a>
                  {file.name}
                  </li>
                );
              })
            }
            </ul>
          }
          { fileChunks.length > 0 ?
            <ul className="pager">
              <li className="middle">Page {this.state.page+1} / {fileChunks.length}</li>
              <li className="previous"><a onClick={() => this.prevPage(fileChunks)} href="#">Previous</a></li>
              <li className="next"><a onClick={() => this.nextPage(fileChunks)} href="#">Next</a></li>
            </ul> : ''
          }
        </Modal>
        <Header />
        <UploadZone onFileDrop={f => this.newFile(f)} onUpload={() => this.uploadFiles()} />
        <Results results={this.state.results} />
      </div>
    );
  }
}

export class Header extends React.Component {
  render() {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className="jumbotron text-center">
            <h1>Upload Your Code!</h1><hr/>
            <p>
              Just drag and drop your source files into the box below then click the analyse button.
              You can view a list of your uploaded files by clicking the 'Files' button in the top right corner.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export class UploadZone extends React.Component {
  onDrop(e) {
    this.refs.uploadZone.className = 'upload-drop-zone';

    e.stopPropagation();
    e.preventDefault();

    if(this.props.onFileDrop) {
      const fileArray = [];
      for(let i = 0; i < e.dataTransfer.files.length; ++i) {
        fileArray.push(e.dataTransfer.files[i]);
      }
      this.props.onFileDrop(fileArray);
    }

    return false;
  }

  onDragOver(e) {
    this.refs.uploadZone.className = 'upload-drop-zone drop';
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    this.refs.uploadZone.className = 'upload-drop-zone';
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  render() {
    return (
      <div id='uploadZone' onDragLeave={e => this.onDragLeave(e)} onDrop={e => this.onDrop(e)} onDragOver={e => this.onDragOver(e)} className="row">
        <div className="col-md-12">
          <div id="drop-zone" ref='uploadZone' className="upload-drop-zone">
            <i>Just drag and drop files here</i>
          </div>
        </div>
        <div className="col-md-12">
          <div className='text-center'>
            <button onClick={e => this.props.onUpload(e)} id="upload" className="btn btn-default">Upload &amp; Analyse</button>
          </div>
        </div>
      </div>
    );
  }
}

export class Footer extends React.Component {
  constructor() {
    super();
    this.state = { isOpen: false };
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div id='footer'>
        <Modal onRequestClose={() => this.closeModal()} isOpen={this.state.isOpen} style={customStyles}>
          <h1>Additional Info</h1><hr/>
          <p className='text-center'>
            CodeAnalyser was developed by William Taylor.
            It was initially developed in 2014 but then got updated in 2016 with a conversion to React and ES6.
            You can contact the developer with any questions at wi11berto@yahoo.co.uk
          </p>
          <hr/>
          <button onClick={() => this.closeModal()} className='btn btn-sm btn-primary pull-right'>Close</button>
        </Modal>
        <div className="row">
          <div className="col-lg-12 text-center">
            <ul className="nav nav-pills nav-justified">
              <li><a onClick={() => this.openModal()} href="#copyright">© 2016 Littlebox</a></li>
              <li><a onClick={() => this.openModal()} href="#creater">By William Taylor</a></li>
              <li><a onClick={() => this.openModal()} href="#email">Email Developer</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export class Results extends React.Component {
  render() {
    const results = this.props.results || [];

    return (
      <div className='row'>
        <div className='col-md-12 text-center'>
          <div className="jumbotron" id="results">
            <h1>View Your Results</h1><hr/>
          </div>
        </div>
        <div className="col-md-12" id="table">
        {
          results.length == 0 ? <p className='text-center'>No results yet. <br/></p> :
          <table id='resultsTable' className="table table-bordered table-hover">
            <thead className='table-header'>
              <tr>
                <th>Statistic Name</th>
                <th>Statistic Value</th>
              </tr>
            </thead>
            <tbody id="results-table">
            {
              results.map(result => {
                return (
                  <tr key={result.key+result.value}>
                  <td>{result.key}</td>
                  <td>{result.value}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        }
        </div>
      </div>
    )
  }
}
