import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DetectedSignal } from '../types';

interface RadarProps {
  signals: DetectedSignal[];
  isScanning: boolean;
}

const Radar: React.FC<RadarProps> = ({ signals, isScanning }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#000')
      .style('border-radius', '50%');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Draw grid circles
    const circles = [0.25, 0.5, 0.75, 1];
    g.selectAll('.grid-circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('r', d => d * radius)
      .attr('fill', 'none')
      .attr('stroke', '#0f0')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    // Draw crosshairs
    g.append('line')
      .attr('x1', -radius)
      .attr('y1', 0)
      .attr('x2', radius)
      .attr('y2', 0)
      .attr('stroke', '#0f0')
      .attr('opacity', 0.3);

    g.append('line')
      .attr('x1', 0)
      .attr('y1', -radius)
      .attr('x2', 0)
      .attr('y2', radius)
      .attr('stroke', '#0f0')
      .attr('opacity', 0.3);

    // Scanner sweep animation
    if (isScanning) {
      const sweep = g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -radius)
        .attr('stroke', 'url(#sweep-gradient)')
        .attr('stroke-width', 2);
      
      // Define gradient for sweep tail
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'sweep-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%'); // Simple vertical line gradient logic is complex for rotation, simplifying visual

      // Use a simple sector for sweep instead
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(0.5); // 0.5 radians slice

      g.append('path')
        .attr('d', arc as any)
        .attr('fill', '#0f0')
        .attr('opacity', 0.2)
        .append('animateTransform')
        .attr('attributeName', 'transform')
        .attr('type', 'rotate')
        .attr('from', '0 0 0')
        .attr('to', '360 0 0')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');
    }

    // Plot Signals
    // Distance maps to radius (Close = center, Far = edge)
    // Signal Strength maps to opacity or size
    // We place them at random angles for simulation since we don't have bearing
    
    signals.forEach((sig, i) => {
      // Map distance (e.g., 0-1000m) to radius (0-radius)
      // Normalize distance: max 1000m for display
      const normalizedDist = Math.min(sig.distance, 1000) / 1000;
      const r = normalizedDist * radius;
      // Stable random angle based on ID
      const angle = (parseInt(sig.id.slice(-4), 16) % 360) * (Math.PI / 180);
      
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);

      const blip = g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', sig.priority === 'CRITICAL' ? '#ef4444' : '#fbbf24')
        .attr('class', 'animate-pulse');
        
      // Label
      g.append('text')
        .attr('x', x + 8)
        .attr('y', y + 4)
        .text(`${Math.round(sig.distance)}m`)
        .attr('fill', '#fff')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');
    });

  }, [signals, isScanning]);

  return (
    <div className="relative flex items-center justify-center p-4 border-2 border-gray-800 rounded-full bg-gray-900/50 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
       <svg ref={svgRef}></svg>
    </div>
  );
};

export default Radar;
