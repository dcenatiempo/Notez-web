<template>
  <footer>
    <button v-bind:disabled='currentTab==="main"' :selected='currentTab==="main"' class='icon' id='home-btn' v-on:click='switchTab'>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
        <g id="Header_x2F_BG" display="none">
          <rect x="-314" y="-446" display="inline" fill="#F1F1F2" width="520" height="520"/>
        </g>
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_3">
          </g>
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Rounded" display="none">
          <g id="ui_x5F_spec_x5F_header_copy_5" display="inline">
          </g>
          <path display="inline" d="M10,19v-5h4v5c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1v-7h1.7c0.46,0,0.68-0.57,0.33-0.87L12.67,3.6
            c-0.38-0.34-0.96-0.34-1.34,0l-8.36,7.53C2.63,11.43,2.84,12,3.3,12H5v7c0,0.55,0.45,1,1,1h3C9.55,20,10,19.55,10,19z"/>
        </g>
        <g id="Sharp" display="none">
          <g id="ui_x5F_spec_x5F_header_copy_4" display="inline">
          </g>
          <path display="inline" d="M10,20v-6h4v6h5v-8h3L12,3L2,12h3v8H10z"/>
        </g>
        <g id="Outline">
          <g id="ui_x5F_spec_x5F_header">
          </g>
          <path id="XMLID_1_" d="M12,5.69l5,4.5V12v6h-2v-4v-2h-2h-2H9v2v4H7v-6v-1.81L12,5.69 M12,3L2,12h3v8h6v-6h2v6h6v-8h3L12,3L12,3z"/>
        </g>
        <g id="Duotone" display="none">
          <g id="ui_x5F_spec_x5F_header_copy_2" display="inline">
          </g>
          <g display="inline">
            <path d="M12,3L2,12h3v8h6v-6h2v6h6v-8h3L12,3z M17,18h-2v-6H9v6H7v-7.81l5-4.5l5,4.5V18z"/>
            <polygon opacity="0.3" points="7,10.19 7,18 9,18 9,12 15,12 15,18 17,18 17,10.19 12,5.69"/>
          </g>
        </g>
        <g id="Fill" display="none">
          <g id="ui_x5F_spec_x5F_header_copy" display="inline">
          </g>
          <path display="inline" d="M10,20v-6h4v6h5v-8h3L12,3L2,12h3v8H10z"/>
        </g>
        <g id="nyt_x5F_exporter_x5F_info" display="none">
        </g>
      </svg>
    </button>
    <button v-bind:disabled='isNotebookDisabled' :selected='currentTab==="notebook"' class='icon' id='notebook-btn' v-on:click='switchTab'>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 1250 1250" xml:space="preserve">
        <g><g transform="translate(170.0, 650.0) scale(0.095,-0.095)"><path d="M1347.6,4922.6l-87.5-87.4v-696.6V3442H958.6c-283.4,0-310.6-6-376.9-75.4c-102.5-99.5-102.5-262.3,0-361.8c66.3-69.4,93.5-75.4,376.9-75.4h301.5v-512.6v-512.6H985.8c-367.9,0-476.4-63.3-479.5-277.4c0-84.4,21.1-126.6,93.5-186.9c84.4-72.4,114.6-78.4,376.9-78.4h283.4V863.8V366.3H958.6c-283.4,0-310.6-6-376.9-75.4c-102.5-99.5-102.5-262.3,0-361.9c66.3-69.3,93.5-75.4,376.9-75.4h301.5v-512.6v-512.6H976.7c-262.4,0-292.5-6-376.9-78.4c-72.4-60.3-93.5-102.5-93.5-187c3-214.1,111.6-277.4,479.5-277.4h274.4v-512.6v-512.6H958.6c-283.4,0-310.6-6-376.9-75.4c-51.3-48.2-75.4-105.5-75.4-180.9c0-75.4,24.1-132.7,75.4-180.9c66.3-69.3,93.5-75.4,376.9-75.4h301.5v-681.5v-681.5l87.5-87.4l87.4-87.5h3923c2722.9,0,3941.1,9,3992.4,33.2c36.2,18.1,84.4,57.3,105.5,87.5c27.1,45.2,36.2,1191.1,36.2,4785.4l3,4728.1l-93.5,84.4l-90.5,81.4H5373.1H1435.1L1347.6,4922.6z M8973.5,104l6-4351.2H5391.2H1802.9v497.5v497.5h301.5c259.3,0,310.6,9,361.8,60.3c81.4,81.4,105.5,196,60.3,304.5c-54.3,129.7-111.6,147.8-434.2,147.8h-289.5v512.6v512.6h289.5c277.4,0,292.5,3,376.9,87.5c117.6,120.6,117.6,247.2,0,367.9c-84.5,84.5-99.5,87.5-376.9,87.5h-289.5v512.6v512.6h289.5c322.6,0,379.9,18.1,434.2,147.8c45.2,108.5,21.1,223.1-60.3,304.5c-51.3,51.3-102.5,60.3-361.8,60.3h-301.5v497.5v497.5h289.5c277.4,0,292.5,3,376.9,87.4c117.6,120.6,117.6,247.3,0,367.9c-84.5,84.4-99.5,87.4-376.9,87.4h-289.5v512.6v512.6h301.5c259.3,0,310.6,9,361.8,60.3c81.4,81.4,105.5,196,60.3,304.6c-54.3,129.7-111.6,147.7-434.2,147.7h-289.5v512.6v512.6l3582.3-6l3579.3-9L8973.5,104z"/><path d="M3352.9,3050c-162.8-66.3-162.8-63.3-162.8-1408.2V399.5l72.4-84.4l72.3-84.4h2056.5h2056.5l72.4,84.4l72.4,84.4v1248.4v1248.4l-72.4,84.4l-72.4,84.4l-2017.3,6C4323.8,3074.1,3386,3065.1,3352.9,3050z M7049.7,1647.9V758.3H5391.2H3732.8v889.5v889.5h1658.5h1658.5V1647.9z"/></g></g>
      </svg>
    </button>
    <button v-bind:disabled='isNoteDisabled' :selected='currentTab==="note"' class='icon' id='note-btn' v-on:click='switchTab'>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve">
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_2">
          </g>
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <g id="ui_x5F_spec_x5F_header">
          </g>
          <g>
            <rect x="11" y="7" width="6" height="2"/>
            <rect x="11" y="11" width="6" height="2"/>
            <rect x="11" y="15" width="6" height="2"/>
            <rect x="7" y="7" width="2" height="2"/>
            <rect x="7" y="11" width="2" height="2"/>
            <rect x="7" y="15" width="2" height="2"/>
            <path d="M20.1,3H3.9C3.4,3,3,3.4,3,3.9v16.2C3,20.5,3.4,21,3.9,21h16.2c0.4,0,0.9-0.5,0.9-0.9V3.9C21,3.4,20.5,3,20.1,3z M19,19H5
              V5h14V19z"/>
          </g>
        </g>
        </svg>
    </button>
    <button class='icon big' id='new-btn' v-on:click='clickActionBtn' v-bind:class="{ rotate: rotateIcon }">
      <svg 
        v-show='currentTab!=="note"'
        xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve">
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_3" display="none">
          </g>
          <path fill="none" d="M0,0h24v24H0V0z"/>
        </g>
        <g id="Outline">
          <g id="ui_x5F_spec_x5F_header" display="none">
          </g>
          <g>
            <path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
            <polygon points="11,17 13,17 13,13 17,13 17,11 13,11 13,7 11,7 11,11 7,11 7,13 11,13"/>
          </g>
        </g>
      </svg>
      <svg
        v-show='currentTab==="note"'
        xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    </button>
  </footer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Toolbar',

  computed: {
    ...mapState(['currentTab', 'currentNotebookId', 'currentNoteId']),

    isNotebookDisabled: function () {
      return this.currentTab === 'notebook' || this.currentNotebookId === -1
    },

    isNoteDisabled: function () {
      return this.currentTab === 'note' || this.currentNoteId === -1
    }

  },

  methods: {
    ...mapMutations(['SET_TAB', 'SET_NOTEBOOKS', 'DELETE_NOTEBOOK', 'SET_NOTES', 'DELETE_NOTE', 'HIDE_MODAL', 'SHOW_MODAL', 'TOGGLE_MARKDOWN']),

    clickActionBtn (e) {
      if (this.currentTab === 'main') {
        this.SHOW_MODAL('add-notebook')
      } else if (this.currentTab === 'notebook') {
        this.SHOW_MODAL('add-note')
      } else if (this.currentTab === 'note') {
        console.log('switching views')
        this.TOGGLE_MARKDOWN()
        this.rotateIcon = !this.rotateIcon
      }
    },

    switchTab (e) {
      var id = e.target.id
      if (id === 'home-btn') {
        this.SET_TAB('main')
      } else if (id === 'notebook-btn') {
        this.SET_TAB('notebook')
      } else if (id === 'note-btn') {
        this.SET_TAB('note')
      }
    }
  },

  data: function () {
    return {
      rotateIcon: true
    }
  }

}
</script>

<style scoped>
  footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: pink;
    height: 3.5em;
  }
  button.icon > svg {
    pointer-events: none;
    transform: rotateZ(0deg);
  }
  button.icon {
    border: none;
    background: transparent;
    height: 35px;
    width: 35px;
    fill: white;
    opacity: 0.5;
  }
  button.big {
    transition: transform ease 100ms;
  }
  button.icon[disabled] {
    fill: white;
    opacity: 0.5;
  }
  button.icon[selected] {
    opacity: .5;
    fill: black;
  }
  #new-btn {
    height: 55px;
    width: 55px;
    opacity: 1;
    fill: white;
  }
  .rotate {
    transform: rotateZ(90deg);
  }
</style>
