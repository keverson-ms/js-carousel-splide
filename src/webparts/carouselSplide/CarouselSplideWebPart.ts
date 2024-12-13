import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import styles from './CarouselSplideWebPart.module.scss';
import * as strings from 'CarouselSplideWebPartStrings';
// import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

export interface ICarouselSplideWebPartProps {
  title: string;
  description: string;
  perPage: number;
  autoplay: boolean;
  rewind: boolean;
  type: string;
  direction: string;
  padding: number;
  // items: IPropertyControlsTestWebPartProps['items'];
}

// export interface IPropertyControlsTestWebPartProps {
//   items: Array<{ title: string; lastname: string; age: number; city: number; sign: boolean }>;
// }
export default class CarouselSplideWebPart extends BaseClientSideWebPart<ICarouselSplideWebPartProps> {

  private minPerPage: number = 1;
  private maxPerPage: number = 5;

  public render(): void {
    const title = this.properties.title ? `<h2>${this.properties.title}</h2>` : ``;
    const description = this.properties.description ? `<p>${this.properties.description}</p>` : ``;

    this.domElement.innerHTML = `
    ${title}
    ${description}
    <div class="${styles.carouselSplide}">
      <div id="splide" class="splide">
        <div class="splide__track">
          <ul class="splide__list">
            <li class="splide__slide" style="background-color: red;">Slide 1</li>
            <li class="splide__slide" style="background-color: green;">Slide 2</li>
            <li class="splide__slide" style="background-color: blue;">Slide 3</li>
            <li class="splide__slide" style="background-color: yellow;">Slide 4</li>
            <li class="splide__slide" style="background-color: orange;">Slide 5</li>
            <li class="splide__slide" style="background-color: purple;">Slide 6</li>
            <li class="splide__slide" style="background-color: pink;">Slide 7</li>
            <li class="splide__slide" style="background-color: brown;">Slide 8</li>
            <li class="splide__slide" style="background-color: black;">Slide 9</li>
            <li class="splide__slide" style="background-color: gray;">Slide 10</li>
          </ul>
        </div>
      </div>
    </div>`;

    this.initializeSplide();
  }

  protected initializeSplide(): void {
    new Splide('.splide', {
      type: this.properties.type,
      perPage: this.properties.perPage,
      autoplay: this.properties.autoplay,
      rewind: this.properties.rewind,
      direction: this.properties.direction ? "rtl" : "ltr",
      padding: `${this.properties.padding}rem`
    }).mount();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public async onInit(): Promise<void> {

    if (this.properties.type === 'fade') this.properties.perPage = this.minPerPage;
    if (!this.properties.perPage) this.properties.perPage = this.minPerPage;
    if (!this.properties.padding) this.properties.padding = 0;

    return super.onInit();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  value: this.properties.title
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true,
                  rows: 5,
                  value: this.properties.description
                }),
                PropertyPaneDropdown('type', {
                  label: strings.TypeFieldLabel,
                  options: [
                    { key: 'loop', text: 'Loop' },
                    { key: 'fade', text: 'Fade' },
                  ],
                  selectedKey: 'loop'
                }),
                PropertyPaneToggle('direction', {
                  label: strings.DirectionFieldLabel,
                  checked: false,
                  onText: strings.DirectionOnText,
                  offText: strings.DirectionOffText,
                  onAriaLabel: 'rtl',
                  offAriaLabel: 'ltr'
                }),
                PropertyPaneCheckbox('autoplay', {
                  text: strings.AutoPlayFieldLabel,
                  checked: this.properties.autoplay
                }),
                PropertyPaneCheckbox('rewind', {
                  text: strings.RewindFieldLabel,
                  checked: this.properties.rewind
                }),
                PropertyPaneSlider('perPage', {
                  min: this.minPerPage,
                  max: this.properties.type === 'fade' ? this.minPerPage : this.maxPerPage,
                  value: this.properties.perPage,
                  label: strings.PerPageFieldLabel,
                  disabled: this.properties.type === 'fade',
                }),
                PropertyPaneSlider('padding', {
                  min: 0,
                  max: 5,
                  value: this.properties.padding,
                  label: strings.PaddingFieldLabel,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
