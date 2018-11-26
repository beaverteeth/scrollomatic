import React, { Component } from 'react'

// facebook scroll wheel normalizer
import normalizeWheel from 'normalize-wheel'

import './component.css'

let idCounter = 1

export default class SideScroller extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            thumbPosition: 0,
            startPosition: 0,
            id: ++idCounter + '_v_scroller',
            clickStarted: false,
        }

        this.railRef = React.createRef()
        this.thumbRef = React.createRef()
    }

    componentDidMount() {
        this.calculate()
    }

    componentDidUpdate() {
        this.calculate()
    }

    calculate = () => {

        const scrollSize = this.props.windowSize < this.props.scrollSize ? this.props.scrollSize : this.props.windowSize

        let showingRatio = this.props.windowSize / scrollSize
        this.thumbSize = this.props.windowSize * showingRatio

    }

    onOnePage = (ev) => {

        const onePage = this.props.windowSize * 0.5

        const ratio = this.state.thumbPosition / (this.props.windowSize - this.thumbSize)
        // get actual postion in scroll range and add the normalized pixel change
        // we increment (by delta) the number of pixels of scroll, not the scroll bar position which is choppy
        // and doesn't scale on really long lists
        const actualPosition = (ratio * (this.props.scrollSize - this.props.windowSize)) + (this.state.inBox == 'left' ? (-1 * onePage) : onePage)

        let newPosition = (actualPosition / (this.props.scrollSize - this.props.windowSize)) * (this.props.windowSize - this.thumbSize)

        if (newPosition < 0)
            newPosition = 0
        else if (newPosition + this.thumbSize > this.props.windowSize)
            newPosition = this.props.windowSize - this.thumbSize

        this.setState({
            thumbPosition: newPosition,
            clickScroll: true
        })
        this.props.onPan(newPosition / (this.props.windowSize - this.thumbSize), true)

        ev.preventDefault()
        ev.stopPropagation()    

    }

    scrollTo = (position, scrollEffect) => {

        scrollEffect = scrollEffect === true
        const actualPosition = position

        let newPosition = (actualPosition / (this.props.scrollSize - this.props.windowSize)) * (this.props.windowSize - this.thumbSize)

        if (newPosition < 0)
            newPosition = 0
        else if (newPosition + this.thumbSize > this.props.windowSize)
            newPosition = this.props.windowSize - this.thumbSize

        this.setState({
            thumbPosition: newPosition,
            clickScroll: true
        })
        this.props.onPan(newPosition / (this.props.windowSize - this.thumbSize), scrollEffect)
    }

    onMouseDown = (ev) => {

        const railBounds = this.railRef.current.getBoundingClientRect()

        if (this.state.inBox !== true) {
            this.onOnePage(ev)
            return
        }

        this.setState({
            mouseDown: true,
            clickScroll: false,
        })

        this.startPosition = this.state.thumbPosition - (ev.clientY - railBounds.top)//- this.thumbRef.current.getBoundingClientRect().left - railBounds.left

        document.addEventListener('mouseup', this.onMouseUp, true);
        document.addEventListener('mousemove', this.onMouseMove, true);        
        ev.preventDefault()
        ev.stopPropagation()

        document.body.style['pointer-events'] = 'none';
    }

    setPosition = (ev) => {
        const railBounds = this.railRef.current.getBoundingClientRect()

        let thumbPosition = ev.clientY - railBounds.top + this.startPosition

        if (thumbPosition < 0)
            thumbPosition = 0
        else if (thumbPosition + this.thumbSize > this.props.windowSize)
            thumbPosition = this.props.windowSize - this.thumbSize

        this.setState({
            thumbPosition
        })

    }

    onTarget = (ev) => {
        const railBounds = this.railRef.current.getBoundingClientRect()
        const left = ev.clientY - railBounds.top

        this.setState({
            inBox: 
                left >= this.state.thumbPosition && left <= this.state.thumbPosition + this.thumbSize ? true : 
                (left <  this.state.thumbPosition ? 'left' : 'right')
        })
    }

    onMouseUp = (ev) => {

        if (this.state.mouseDown) {
            this.setState({
                mouseDown: false
            })
        }

        if (this.state.clickScroll) {
            this.setState({
                clickScroll: false
            })

            ev.stopPropagation();
            ev.preventDefault();            
            return
        }

        const railBounds = this.railRef.current.getBoundingClientRect()
        
        if (ev.clientX >= railBounds.left && ev.clientX <= railBounds.right &&
            ev.clientY >= railBounds.top && ev.clientY <= railBounds.bottom) {
            // special?
        } else {
            this.setState({
                showing: false
            })   
        }

        document.removeEventListener('mouseup', this.onMouseUp, true);
        document.removeEventListener('mousemove', this.onMouseMove, true);
        ev.stopPropagation();
        ev.preventDefault();            

        document.body.style['pointer-events'] = 'auto';
    }

    onMouseMove = (ev) => {

        ev.stopPropagation ();
        ev.preventDefault()

        this.onTarget(ev)
       

        if (!this.state.mouseDown)
            return false

        this.setPosition(ev)

        if (this.props.onPan) 
            this.props.onPan(this.state.thumbPosition / (this.props.windowSize - this.thumbSize))
        
        return true        
    }

    onMouseEnter = (ev) => {
        this.setState({
            showing: true
        })
    }

    onMouseLeave = (ev) => {
        if (!this.state.mouseDown)
            this.setState({
                showing: false
            })
    }

    onWheel = (ev) => {

        // call fancy facebook function that un-messes all the browser variations with
        // wheel scroll deltas (thank you FB)
        const normalized = normalizeWheel(ev)

        if (!this.inWheel) {
            this.inWheel = true
        }


        if (normalized.pixelY) {

            // get the percentage along of scroll position to scroll area (width - with of thumb)
            const ratio = this.state.thumbPosition / (this.props.windowSize - this.thumbSize)
            // get actual postion in scroll range and add the normalized pixel change
            // we increment (by delta) the number of pixels of scroll, not the scroll bar position which is choppy
            // and doesn't scale on really long lists
            const actualPosition = (ratio * (this.props.scrollSize - this.props.windowSize)) + normalized.pixelY

            // convert this back to scroll pixels..
            let newPosition = (actualPosition / (this.props.scrollSize - this.props.windowSize)) * (this.props.windowSize - this.thumbSize)

            if (newPosition < 0)
                newPosition = 0
            else if (newPosition + this.thumbSize > this.props.windowSize)
                newPosition = this.props.windowSize - this.thumbSize

            this.setState({
                thumbPosition: newPosition,
                showing: normalized.pixelY ? true : false,
            })
            this.props.onPan(newPosition / (this.props.windowSize - this.thumbSize))
        }

        if (this.scrollHideTo)
            clearTimeout(this.scrollHideTo)

        this.scrollHideTo = setTimeout(() => {
            this.scrollHideTo = null;
            this.setState({
                showing: false,
                mouseDown: false,
                inBox: false
            })
            this.inWheel = false
        }, 500)

        ev.preventDefault()
    }

    render() {

        let thumbClass = 'scrollomatic-side-thumb'

        if (this.state.mouseDown || this.state.inBox === true)
            thumbClass += ' scrolling'

        return (
            <div 
                id={this.state.id}
                ref={this.railRef}
                className="scrollomatic-side-rail"
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onWheel={this.onWheel}
                style={{
                    height: this.props.windowSize,
                    opacity: this.state.showing ? 1 : 0.001
                }}
                >
                <div 
                    ref={this.thumbRef}
                    className={thumbClass}
                    style={{
                        top: this.state.thumbPosition,
                        height: this.thumbSize
                    }}/>
            </div>
        )

    }

}
