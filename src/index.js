import React, { Component } from 'react'

import './component.css'

import BottomScroller from './hscroll'
import SideScroller from './vscroll'

export default class Scrollomatic extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            vPos: 0,
            hPos: 0
        }

        this.outerRef = React.createRef()
        this.innerRef = React.createRef()

        this.horzRef = React.createRef()
        this.vertRef = React.createRef()

        this.dimCheckInterval = null
    }

    componentDidMount() {
        this.dimCheckInterval = setInterval(this.getDims, 100)
    }

    componentWillUnmount() {
        clearInterval(this.dimCheckInterval)
    }

    getDims = () => {
        const bounds = this.outerRef.current.getBoundingClientRect()

        const newState = {
            windowWidth: bounds.width,
            windowHeight: bounds.height,

            scrollWidth: this.innerRef.current.scrollWidth,
            scrollHeight: this.innerRef.current.scrollHeight
        }

        this.setState({
            ... newState,            
            dims: true,
            showHorz: newState.scrollWidth > newState.windowWidth ? true : false,
            showVert: newState.scrollHeight > newState.windowHeight ? true : false,
        })

    }

    onWheel = (ev) => {
        if (this.state.showHorz)
            this.horzRef.current.onWheel(ev)
        if (this.state.showVert)
            this.vertRef.current.onWheel(ev)        
    }

    onHScroll = (ratio, isPage) => {
        this.setState({
            hpos: -1 * (ratio * (this.state.scrollWidth - this.state.windowWidth)),
            onePage: isPage
        })

        if (this.unsetTo)
            clearTimeout(this.unsetTo)

        if (isPage) {
            this.unsetTo = setTimeout(() => {            
                this.unsetTo = null
                this.setState({
                    onePage: false
                })
            }, 1100)
        }
    }

    onVScroll = (ratio, isPage) => {
        this.setState({
            vpos: -1 * (ratio * (this.state.scrollHeight - this.state.windowHeight)),
            onePage: isPage
        })

        if (this.unsetTo)
            clearTimeout(this.unsetTo)

        if (isPage) {

    this.unsetTo = setTimeout(() => {            
        this.unsetTo = null
        this.setState({
            onePage: false
        })
    }, 1100)

        }
    }

    pan = (left, top) => {
        if (left && this.state.showHorz) 
            this.horzRef.current.scrollTo(left)
        if (top && this.state.showVert)
            this.vertRef.current.scrollTo(top)
    }

    render() {

        let innerClasses = 'scrollomatic-inner-container'

        if (this.state.onePage)
            innerClasses += ' slow-scroll'
       

        return (
            <div
                ref={this.outerRef} 
                style={{...this.props.style}}
                className="scrollomatic-outer-container">
                <div 
                    ref={this.innerRef} 
                    className={innerClasses}
                    onWheel={this.onWheel}
                    style={{
                        left: this.state.hpos,
                        top: this.state.vpos
                    }}
                    >
                    {this.props.children}
                </div>
                {this.state.showHorz && 
                    <BottomScroller 
                        ref={this.horzRef} 
                        scrollSize={this.state.scrollWidth} 
                        windowSize={this.state.windowWidth} 
                        corner={this.state.showHorz && this.state.showVert} 
                        onPan={this.onHScroll}/>}
                {this.state.showVert && 
                    <SideScroller 
                        ref={this.vertRef} 
                        scrollSize={this.state.scrollHeight} 
                        windowSize={this.state.windowHeight} 
                        corner={this.state.showHorz && this.state.showVert} 
                        onPan={this.onVScroll}/>}
            </div>

        )
    }

}