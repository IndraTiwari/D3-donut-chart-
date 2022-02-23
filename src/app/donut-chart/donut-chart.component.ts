import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  width = 200;
  height = 200;
  margin = 50;
  radius = Math.min(this.width, this.height) / 2 - this.margin;
  svg;
  color;
  pie;
  data_ready;

  // Create dummy data
  public data = { a: 70, b: 30 };

  constructor() { }

  ngOnInit() {
    this.draw();
  }


  title = 'text inside inner radius';
  draw() {
    this.svg = d3
      .select('#mychart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );

    // set the color scale
    this.color = d3
      .scaleOrdinal()
      .domain(Object.keys(this.data))
      .range(['red', 'green']);

    // Compute the position of each group on the pie:
    this.pie = d3.pie().value(function (d) {
      return d.value;
    });

    this.data_ready = this.pie(d3.entries(this.data));

    this.svg
      .selectAll()
      .data(this.data_ready)
      .enter()
      .append('path')
      .attr('d',d3.arc()
          .innerRadius(80) // This is the size of the donut hole
          .outerRadius(this.radius)
      )
      .attr('fill', (d) => {
        return this.color(d.data.key);
      })
      .attr('stroke', 'white')
      .style('stroke-width', '4px')
      .style('opacity', 0.7);


    const labelLocation = d3.arc().innerRadius(80).outerRadius(this.radius); // position of label on donut arc

    this.svg
      .selectAll()
      .data(this.data_ready)
      .enter()
      .append('text')
      .text((d) => d.data.value)
      .attr('transform', (d) => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15);

    this.svg       // for adding text inside donut circle 
      .append('text')
      .attr('text-anchor', 'middle')
      .attr("dy", ".25em")
      .attr('y', -10)
      .style('font-weight', '600')
      .style('font-size', '10px')
      .text('Total available value');

    this.svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".25em")
      .attr("y", 8)
      .style('font-weight', '600')
      .style('font-size', '10px')
      .text('to be shown in chart');
  }
}

