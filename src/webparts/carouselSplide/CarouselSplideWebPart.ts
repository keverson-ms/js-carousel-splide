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
// import * as numbers from 'CarouselSplideWebPartNumbers';

export interface ICarouselSplideWebPartProps {
  description: string;
  perPage: number;
  autoplay: boolean;
  rewind: boolean;
  type: string;
  direction: string;
}

export default class CarouselSplideWebPart extends BaseClientSideWebPart<ICarouselSplideWebPartProps> {

  private minPerPage: number = 1;
  private maxPerPage: number = 5;
  public render(): void {
    this.domElement.innerHTML = `
    <p>${this.properties.description}</p>
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

  private initializeSplide(): void {
    new Splide('#splide', {
      type: this.properties.type,
      perPage: this.properties.perPage,
      autoplay: this.properties.autoplay,
      rewind: this.properties.rewind,
      direction: this.properties.direction ? "rtl" : "ltr"
    }).mount();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public onInit(): Promise<void> {
    if (this.properties.type === 'fade') {
      this.properties.perPage = this.minPerPage
    }

    return super.onInit();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'type' && newValue === 'fade') {
      this.properties.perPage = this.minPerPage;
      this.context.propertyPane.refresh();
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    console.log(this);
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
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
                  onText: 'Right',
                  offText: 'Left',
                  onAriaLabel: 'rtl',
                  offAriaLabel: 'ltr'
                }),
                PropertyPaneCheckbox('autoplay', {
                  text: `Auto Play?`,
                  checked: this.properties.autoplay
                }),
                PropertyPaneCheckbox('rewind', {
                  text: `Retroceder?`,
                  checked: this.properties.rewind
                }),
                PropertyPaneSlider('perPage', {
                  label: strings.PerPageFieldLabel,
                  min: this.minPerPage,
                  max: this.properties.type === 'fade' ? this.minPerPage : this.maxPerPage,
                  value: this.properties.perPage,
                  ariaLabel: 'itens',
                  disabled: this.properties.type === 'fade',
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
