import { Button, Table, Page, Modal, Input, Dropdown, DropdownItem, Icon, Switch, Select, Option,
 Row, Card, Spin, Col, DropdownMenu, BackTop, Message, Progress, Tooltip,
 Tabs, TabPane, Menu, MenuItem, FormItem, Form, RadioGroup, Radio, DatePicker,
 CheckboxGroup, Checkbox, Carousel, CarouselItem
} from 'iview';

export default {
  install: Vue => {
    Vue.config.productionTip = false

    Vue.component('Button', Button);
    Vue.component('Table', Table);
    Vue.component('Page', Page);
    Vue.component('Modal', Modal);
    Vue.component('Input', Input);
    Vue.component('Dropdown', Dropdown);
    Vue.component('DropdownItem', DropdownItem);
    Vue.component('Icon', Icon);
    Vue.component('Row', Row);
    Vue.component('Card', Card);
    Vue.component('Spin', Spin);
    Vue.component('Col', Col);
    Vue.component('DropdownMenu', DropdownMenu);
    Vue.component('BackTop', BackTop);
    Vue.component('i-Switch', Switch)
    Vue.component('Select', Select)
    Vue.component('Option', Option)
    Vue.component('Progress', Progress)
    Vue.component('Tooltip', Tooltip)
    Vue.component('Tabs', Tabs)
    Vue.component('TabPane', TabPane)
    Vue.component('Menu', Menu)
    Vue.component('MenuItem', MenuItem)
    Vue.component('FormItem', FormItem)
    Vue.component('Form', Form)
    Vue.component('Radio', Radio)
    Vue.component('RadioGroup', RadioGroup)
    Vue.component('DatePicker', DatePicker)
    Vue.component('CheckboxGroup', CheckboxGroup)
    Vue.component('Checkbox', Checkbox)
    Vue.component('Carousel', Carousel)
    Vue.component('CarouselItem', CarouselItem)
    Vue.prototype.$Message = Message
    Vue.prototype.$Modal = Modal
  }
}
