document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 0. AIRPORT SPLIT-FLAP TICKER LOGO ANIMATION
  // ==========================================================================
  const flaps = document.querySelectorAll('.brand-logo-ticker .flap');
  if (flaps.length > 0) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ. ';
    flaps.forEach((flap, index) => {
      const target = flap.getAttribute('data-target');
      let count = 0;
      const maxTicks = 6 + index * 2; // Staggered click duration per flap

      function tick() {
        if (count < maxTicks) {
          flap.textContent = chars[Math.floor(Math.random() * chars.length)];
          count++;
          setTimeout(tick, 45); // Flap cycle speed
        } else {
          flap.textContent = target;
        }
      }
      setTimeout(tick, 100 + index * 30); // Staggered starting clicks
    });
  }
  // ==========================================================================
  // 1. REAL-TIME UTC CLOCK DISPLAY
  // ==========================================================================
  const clockElement = document.getElementById('telemetry-clock');
  
  function updateUTCClock() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds} UTC`;
  }
  
  // Initialize clock and update every second
  updateUTCClock();
  setInterval(updateUTCClock, 1000);

  // ==========================================================================
  // 2. METRIC TICK COUNT-UP ANIMATION
  // ==========================================================================
  const messagesMetric = document.getElementById('metric-messages');
  const tpsMetric = document.getElementById('metric-tps');
  
  function animateValue(element, start, end, duration, formatFn) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = formatFn(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Formatters
  const formatMessages = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M+';
    }
    return value.toLocaleString();
  };

  const formatTPS = (value) => {
    return value + ' TPS';
  };

  // Run animations slightly after load
  setTimeout(() => {
    animateValue(messagesMetric, 0, 3000000, 1600, formatMessages);
    animateValue(tpsMetric, 0, 180, 1200, formatTPS);
  }, 300);


  // ==========================================================================
  // 3. REGIONAL FAILOVER SIMULATION ENGINE
  // ==========================================================================
  const failoverBtn = document.getElementById('btn-trigger-failover');
  const statusMsg = document.getElementById('failover-status-msg');
  const terminalLogs = document.querySelector('.terminal-logs');
  
  // Map Elements
  const regionEast = document.getElementById('region-east');
  const regionWest = document.getElementById('region-west');
  const statusEast = document.getElementById('status-east');
  const statusWest = document.getElementById('status-west');
  const pulseWest = document.getElementById('pulse-west');
  const flowLine = document.getElementById('flow-line');
  const telemetryCard = document.querySelector('.telemetry-card');
  const rtoMetric = document.getElementById('metric-rto');

  let simulationRunning = false;
  let simulationCompleted = false;

  // Pre-configured log timestamps and contents
  const failoverLogs = [
    { type: 'warn', text: 'Regional degradation detected in us-east-1. Gateway latency spikes > 450ms.' },
    { type: 'warn', text: 'Health checks failing on ECS clusters in us-east-1. Activating Regional Failover.' },
    { type: 'info', text: 'Securing transaction dual-write checkpoints. Validating standby DynamoDB stores.' },
    { type: 'info', text: 'Rerouting messaging consumer threads. Splitting Kafka stream replication indices.' },
    { type: 'info', text: 'Updating Route 53 DNS records and API Gateway endpoints to backup region.' },
    { type: 'success', text: 'Failover complete. All services successfully active in us-west-2. RTO: 16.2 seconds.' }
  ];

  function addLogLine(tagType, text) {
    const now = new Date();
    const hr = String(now.getUTCHours()).padStart(2, '0');
    const min = String(now.getUTCMinutes()).padStart(2, '0');
    const sec = String(now.getUTCSeconds()).padStart(2, '0');
    const timestampStr = `[${hr}:${min}:${sec}]`;

    const logRow = document.createElement('div');
    logRow.className = 'log-line';
    
    let tagClass = 'tag-info';
    if (tagType === 'warn') tagClass = 'tag-warn';
    if (tagType === 'success') tagClass = 'tag-success';
    if (tagType === 'error') tagClass = 'tag-error';

    logRow.innerHTML = `<span class="log-timestamp">${timestampStr}</span> <span class="log-tag ${tagClass}">${tagType.toUpperCase()}</span> ${text}`;
    
    terminalLogs.appendChild(logRow);
    
    // Auto-scroll logs to bottom
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function runFailoverSequence() {
    simulationRunning = true;
    failoverBtn.disabled = true;
    failoverBtn.textContent = 'Executing Failover...';
    telemetryCard.classList.add('failover-active');
    
    // 1. Initial Failure Spikes
    statusMsg.textContent = 'Simulating traffic failures in primary AWS region...';
    addLogLine('warn', failoverLogs[0].text);
    
    // Animate flow line into error state
    flowLine.classList.add('failed-flow');
    
    setTimeout(() => {
      // 2. Health Failure
      addLogLine('warn', failoverLogs[1].text);
      regionEast.classList.remove('active');
      regionEast.classList.add('failed');
      statusEast.textContent = 'DEGRADED';
      
      // Update map text
      statusMsg.textContent = 'Degradation confirmed. Securing database dual-write sync states...';
    }, 2500);

    setTimeout(() => {
      // 3. Database Checkpoints
      addLogLine('info', failoverLogs[2].text);
      statusMsg.textContent = 'Re-routing messaging pipelines and consumer threads...';
      flowLine.classList.remove('failed-flow');
      flowLine.classList.add('re-routing');
    }, 5500);

    setTimeout(() => {
      // 4. Kafka Stream Splitting
      addLogLine('info', failoverLogs[3].text);
      statusMsg.textContent = 'Redirecting Route 53 public traffic entries...';
    }, 8500);

    setTimeout(() => {
      // 5. DNS and Endpoint migration
      addLogLine('info', failoverLogs[4].text);
      statusMsg.textContent = 'Activating standby backend infrastructure...';
    }, 11500);

    setTimeout(() => {
      // 6. Complete Success
      addLogLine('success', failoverLogs[5].text);
      
      // Transition West Node to Active
      pulseWest.classList.remove('invisible');
      regionWest.classList.remove('standby');
      regionWest.classList.add('active');
      statusWest.textContent = 'ACTIVE';
      
      // Show flow line to West
      flowLine.classList.remove('re-routing');
      
      // Change RTO display
      rtoMetric.textContent = '16.2s';
      rtoMetric.style.color = 'var(--status-green)';
      
      statusMsg.textContent = 'System completely restored. Active Region: us-west-2';
      
      failoverBtn.disabled = false;
      failoverBtn.textContent = 'Reset Telemetry';
      
      simulationRunning = false;
      simulationCompleted = true;
    }, 15000);
  }

  function resetFailover() {
    // Reset all DOM modifications
    regionEast.classList.remove('failed');
    regionEast.classList.add('active');
    statusEast.textContent = 'ACTIVE';

    regionWest.classList.remove('active');
    regionWest.classList.add('standby');
    statusWest.textContent = 'STANDBY';
    pulseWest.classList.add('invisible');

    flowLine.className.baseVal = 'flow-line-active';
    telemetryCard.classList.remove('failover-active');
    rtoMetric.textContent = '< 20m';
    rtoMetric.style.color = '';

    statusMsg.textContent = 'Click button to trigger failure and re-route traffic';
    
    // Clear custom simulated logs, leaving original 3 lines
    const logLines = Array.from(terminalLogs.children);
    for (let i = logLines.length - 1; i >= 3; i--) {
      terminalLogs.removeChild(logLines[i]);
    }
    
    addLogLine('info', 'System diagnostics reset. Active Region returned to us-east-1.');

    failoverBtn.textContent = 'Simulate Live Regional Failover';
    simulationCompleted = false;
  }

  failoverBtn.addEventListener('click', () => {
    if (simulationRunning) return;
    
    if (simulationCompleted) {
      resetFailover();
    } else {
      runFailoverSequence();
    }
  });

  // ==========================================================================
  // 4. CORE COMPETENCIES (SKILLS) CATEGORY FILTER
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states on tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Filter grid
      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          // Fade-in animation helper
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================================================
  // 5. COPY-TO-CLIPBOARD ACTIONS FOR CONTACT BUTTONS
  // ==========================================================================
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const emailStatus = document.getElementById('copy-email-status');

  function copyTextToClipboard(text, statusElement) {
    if (!navigator.clipboard) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showCopiedFeedback(statusElement);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showCopiedFeedback(statusElement);
    }, (err) => {
      console.error('Async: Could not copy text: ', err);
    });
  }

  function showCopiedFeedback(statusElement) {
    statusElement.textContent = 'Copied!';
    statusElement.style.background = 'var(--status-green)';
    statusElement.style.color = '#000';
    statusElement.style.borderColor = 'var(--status-green)';

    setTimeout(() => {
      statusElement.textContent = 'Copy';
      statusElement.style.background = '';
      statusElement.style.color = '';
      statusElement.style.borderColor = '';
    }, 2000);
  }

  copyEmailBtn.addEventListener('click', () => {
    const emailStr = copyEmailBtn.getAttribute('data-clipboard');
    copyTextToClipboard(emailStr, emailStatus);
  });

  // ==========================================================================
  // 6. INTERACTIVE GEOGRAPHY JOURNEY GLOBE (D3.JS TOPOLOGY ENGINE)
  // ==========================================================================
  const canvas = document.getElementById('globe-canvas');
  const detailsCard = document.getElementById('map-node-details');
  const detailsTag = document.getElementById('details-node-tag');
  const detailsTitle = document.getElementById('details-node-title');
  const detailsText = document.getElementById('details-node-text');
  const detailsMeta = document.getElementById('details-node-meta');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = 260; // Globe sphere radius - Zoomed in beautifully

    // Rotation states (in radians)
    // Starts centered on the USA (-1.6rad / -92deg longitude) and a 24deg earth tilt (0.42rad latitude)
    let rotation = { lambda: -1.6, phi: 0.42 }; 
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoSpinActive = true;
    let autoSpinTimer = null;
    let activeNodeId = 'pnw';

    // Coordinates of Resume Pins (Longitude, Latitude) with custom label offsets for spacing
    const pins = [
      { id: "pnw", name: "Pacific Northwest", lon: -122.0, lat: 44.5, label: "Origin", tag: "ORIGIN", meta: "📍 Roots", align: "right", dx: -8, dy: -2 },
      { id: "notredame", name: "Notre Dame", lon: -84.5, lat: 39.8, label: "Notre Dame", tag: "UNDERGRADUATE", meta: "☘️ Economics & Systems Foundation", align: "left", dx: 8, dy: 10 },
      { id: "madrid", name: "Madrid", lon: -3.7, lat: 40.4, label: "Madrid", tag: "FULBRIGHT SCHOLAR", meta: "🇪🇸 Systems of Language & Empathy", align: "left", dx: 8, dy: -4 },
      { id: "chicago", name: "Chicago", lon: -88.0, lat: 42.8, label: "Chicago", tag: "FINANCIAL SYSTEMS", meta: "🏢 Systems of Financial Exchange", align: "right", dx: -8, dy: -8 },
      { id: "nyc", name: "New York", lon: -74.0, lat: 40.7, label: "New York", tag: "COMPUTER SCIENCE", meta: "🎓 Systems of Digital Architecture", align: "left", dx: 8, dy: -4 },
      { id: "dallas", name: "Dallas", lon: -96.8, lat: 32.7, label: "Dallas", tag: "PLATFORM SCALE", meta: "☁️ Systems of Cloud Scale & Reliability", align: "right", dx: -8, dy: 6 }
    ];

    const nodeData = {
      pnw: {
        tag: "ORIGIN",
        title: "Pacific Northwest",
        text: "I grew up in Portland and Seattle, spending my time rowing on the water, enjoying the mountains, and taking road trips down to California.",
        meta: "📍 Roots"
      },
      notredame: {
        tag: "UNDERGRADUATE",
        title: "Notre Dame, Indiana",
        text: "Graduated Magna Cum Laude with a B.A. in International Economics from the University of Notre Dame. Studying international economic models taught me to see flow systems, transaction structures, and global dependencies—providing a rigorous analytical foundation that naturally carried over into computer science and platform engineering.",
        meta: "☘️ Economics & Systems Foundation"
      },
      madrid: {
        tag: "FULBRIGHT SCHOLAR",
        title: "Madrid, Spain",
        text: "Fulbright Scholar teaching English and exploring Spain. Studying language taught me to understand how other people see things.",
        meta: "🇪🇸 Systems of Language & Empathy"
      },
      chicago: {
        tag: "FINANCIAL SYSTEMS",
        title: "Chicago, Illinois",
        text: "Senior Transfer Pricing Consultant at Ernst & Young (EY). Analyzed global financial systems, intercompany cash flows, and cross-border transactions for Fortune 500 entities. Here, I pioneered my first revenue-generating automation scripts, sparking a lifelong fascination with ordering complex transaction pipelines.",
        meta: "🏢 Systems of Financial Exchange"
      },
      nyc: {
        tag: "COMPUTER SCIENCE",
        title: "New York, NY",
        text: "M.S. in Computer Science at Columbia University and Contract Engineer. Transitioned from financial systems to digital cloud architecture. Built Convex GitHub ingestion pipelines, contributed to open-source environmental simulation tools at Columbia DESDR, and learned to translate raw data flows into intelligible systems.",
        meta: "🎓 Systems of Digital Architecture"
      },
      dallas: {
        tag: "PLATFORM SCALE",
        title: "Dallas, Texas",
        text: "Senior Associate Software Engineer at Capital One. Leading live production regional failover exercises, designing configuration-driven deduplication APIs, and migrating active repos with zero-downtime DynamoDB dual-write strategies. Here, I build resilient platforms processing 3M+ messages monthly.",
        meta: "☁️ Systems of Cloud Scale & Reliability"
      }
    };

    function updateNodeDetails(nodeId) {
      const data = nodeData[nodeId];
      if (!data) return;

      // Smooth content update fade transition
      detailsCard.style.opacity = '0';
      detailsCard.style.transform = 'translateY(4px)';

      setTimeout(() => {
        detailsTag.textContent = data.tag;
        detailsTitle.textContent = data.title;
        detailsText.textContent = data.text;
        detailsMeta.textContent = data.meta;

        detailsCard.style.opacity = '1';
        detailsCard.style.transform = 'translateY(0)';
      }, 150);
    }

    // Load offline TopoJSON map
    fetch('land-110m.json')
      .then(res => res.json())
      .then(worldData => {
        const land = topojson.feature(worldData, worldData.objects.land);

        // D3 Orthographic projection linked to the canvas
        const projection = d3.geoOrthographic()
          .scale(r)
          .translate([cx, cy])
          .rotate([-rotation.lambda * 180 / Math.PI, -rotation.phi * 180 / Math.PI]);

        const path = d3.geoPath(projection, ctx);
        const graticule = d3.geoGraticule().step([30, 30]);

        // Helper to project coordinates returning 2D screen positions (x, y)
        const projectD3 = (lon, lat) => {
          const [x, y] = projection([lon, lat]);
          return { x, y };
        };

        // Draw connections, land, graticule, and pins
        function drawGlobe() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 1. Draw Globe Sphere Background
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff'; // Solid warm white/paper base
          ctx.fill();
          ctx.strokeStyle = '#dad4c5';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Clip paths to the globe boundaries
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.clip();

          // 2. Draw Graticules (sketched longitude and latitude lines)
          ctx.strokeStyle = 'rgba(218, 212, 197, 0.45)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          path(graticule());
          ctx.stroke();

          // 3. Draw Stylized Continent Boundaries (warm ink sage/seafoam)
          ctx.strokeStyle = '#76949f';
          ctx.lineWidth = 1.25;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          path(land);
          ctx.stroke();

          ctx.restore();

          // 4. Draw Connecting Arcs
          drawConnections();

          // 5. Draw Resume Pins
          drawPins();
        }

        // Connect pins using curved dashed arcs
        function drawConnections() {
          const conn = (p1, p2) => {
            ctx.beginPath();
            ctx.setLineDash([3, 4]);
            ctx.strokeStyle = 'rgba(26, 77, 112, 0.4)';
            ctx.lineWidth = 1.5;
            
            let first = true;
            for (let i = 0; i <= 20; i++) {
              const t = i / 20;
              const lon = p1.lon + (p2.lon - p1.lon) * t;
              const lat = p1.lat + (p2.lat - p1.lat) * t;
              
              // Standard arch height to simulate aerial flow
              const arch = Math.sin(t * Math.PI) * 8;
              const { x, y } = projectD3(lon, lat + arch);

              // Basic front hemisphere rendering check
              const dx = x - cx;
              const dy = y - cy;
              const isFront = Math.sqrt(dx*dx + dy*dy) < r;

              if (isFront) {
                if (first) {
                  ctx.moveTo(x, y);
                  first = false;
                } else {
                  ctx.lineTo(x, y);
                }
              } else {
                first = true;
              }
            }
            ctx.stroke();
            ctx.setLineDash([]);
          };

          const pinMap = {};
          pins.forEach(p => pinMap[p.id] = p);

          conn(pinMap.pnw, pinMap.notredame);
          conn(pinMap.notredame, pinMap.madrid);
          conn(pinMap.madrid, pinMap.chicago);
          conn(pinMap.chicago, pinMap.nyc);
          conn(pinMap.chicago, pinMap.dallas);
        }

        // Draw pin nodes on the front face of the globe
        function drawPins() {
          pins.forEach(p => {
            const { x, y } = projectD3(p.lon, p.lat);
            
            // Check if pin is visible on the front face of the projection
            const dx = x - cx;
            const dy = y - cy;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Using standard projection visibility logic for orthographic view
            // In orthographic projection, the back hemisphere is clipped or folded back;
            // D3 projection will output coordinates outside the radius if it's on the back face
            // but a simpler, cleaner way is checking if D3 rotated coordinates are facing front:
            const rotatedCoords = projection.rotate();
            const rLon = -rotatedCoords[0] * Math.PI / 180;
            const rLat = -rotatedCoords[1] * Math.PI / 180;
            const pLon = p.lon * Math.PI / 180;
            const pLat = p.lat * Math.PI / 180;
            
            const cosDot = Math.sin(pLat) * Math.sin(rLat) + 
                          Math.cos(pLat) * Math.cos(rLat) * Math.cos(pLon - rLon);

            if (cosDot > 0 && distance < r) {
              const isActive = p.id === activeNodeId;

              // Shadow rings
              ctx.beginPath();
              ctx.arc(x, y, isActive ? 12 : 8, 0, Math.PI * 2);
              ctx.fillStyle = isActive ? 'rgba(32, 64, 96, 0.08)' : 'rgba(143, 174, 180, 0.15)';
              ctx.fill();

              // Border ring
              ctx.beginPath();
              ctx.arc(x, y, isActive ? 8 : 5, 0, Math.PI * 2);
              ctx.strokeStyle = isActive ? '#204060' : '#8faeb4';
              ctx.lineWidth = isActive ? 2.5 : 1.5;
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.stroke();

              // Pin core dot
              ctx.beginPath();
              ctx.arc(x, y, isActive ? 4 : 2.5, 0, Math.PI * 2);
              ctx.fillStyle = isActive ? '#204060' : '#8faeb4';
              ctx.fill();

              // Text Label
              ctx.font = isActive ? 'bold 11px Georgia' : '10px Georgia';
              ctx.fillStyle = isActive ? '#25292c' : '#555b60';
              ctx.textAlign = p.align || 'center';
              ctx.fillText(p.label, x + (p.dx || 0), y + (p.dy || -14));
            }
          });
        }

        // Interaction Handlers (drag to rotate)
        canvas.addEventListener('mousedown', (e) => {
          isDragging = true;
          autoSpinActive = false;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
          isDragging = false;
          clearTimeout(autoSpinTimer);
          autoSpinTimer = setTimeout(() => {
            autoSpinActive = true;
          }, 4000);
        });

        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            // Rotation in radians
            rotation.lambda += deltaX * 0.005;
            rotation.phi += deltaY * 0.005;

            // Prevent flipping upside down
            rotation.phi = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotation.phi));

            // Sync with projection rotation
            projection.rotate([-rotation.lambda * 180 / Math.PI, -rotation.phi * 180 / Math.PI]);

            previousMousePosition = { x: e.clientX, y: e.clientY };
            drawGlobe();
          } else {
            // Hover cursor change if hovering over front-face pins
            let isHoveringNode = false;
            pins.forEach(p => {
              const { x, y } = projectD3(p.lon, p.lat);
              const dx = x - cx;
              const dy = y - cy;
              const distance = Math.sqrt(dx * dx + dy * dy);

              const rotatedCoords = projection.rotate();
              const rLon = -rotatedCoords[0] * Math.PI / 180;
              const rLat = -rotatedCoords[1] * Math.PI / 180;
              const pLon = p.lon * Math.PI / 180;
              const pLat = p.lat * Math.PI / 180;
              
              const cosDot = Math.sin(pLat) * Math.sin(rLat) + 
                            Math.cos(pLat) * Math.cos(rLat) * Math.cos(pLon - rLon);

              if (cosDot > 0 && distance < r) {
                const hx = mouseX - x;
                const hy = mouseY - y;
                if (Math.sqrt(hx * hx + hy * hy) < 11) {
                  isHoveringNode = true;
                }
              }
            });
            canvas.style.cursor = isHoveringNode ? 'pointer' : 'grab';
          }
        });

        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          let clickedPin = null;
          pins.forEach(p => {
            const { x, y } = projectD3(p.lon, p.lat);
            const dx = x - cx;
            const dy = y - cy;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const rotatedCoords = projection.rotate();
            const rLon = -rotatedCoords[0] * Math.PI / 180;
            const rLat = -rotatedCoords[1] * Math.PI / 180;
            const pLon = p.lon * Math.PI / 180;
            const pLat = p.lat * Math.PI / 180;
            
            const cosDot = Math.sin(pLat) * Math.sin(rLat) + 
                          Math.cos(pLat) * Math.cos(rLat) * Math.cos(pLon - rLon);

            if (cosDot > 0 && distance < r) {
              const hx = mouseX - x;
              const hy = mouseY - y;
              if (Math.sqrt(hx * hx + hy * hy) < 11) {
                clickedPin = p;
              }
            }
          });

          if (clickedPin) {
            activeNodeId = clickedPin.id;
            updateNodeDetails(clickedPin.id);
            drawGlobe();
          }
        });

        // Slow, calm spin animation loop
        function animate() {
          if (autoSpinActive) {
            rotation.lambda += 0.0015;
            projection.rotate([-rotation.lambda * 180 / Math.PI, -rotation.phi * 180 / Math.PI]);
            drawGlobe();
          }
          requestAnimationFrame(animate);
        }

        // Perform initial draw
        drawGlobe();
        animate();
      })
      .catch(err => {
        console.error('Failed to load world geometry map topology:', err);
      });
  }

  // ==========================================================================
  // 7. BEYOND THE TERMINAL (TACTILE SHUFFLE DECK)
  // ==========================================================================
  const deckContainer = document.getElementById('interests-deck');
  const shuffleBtn = document.getElementById('btn-shuffle-deck');

  if (deckContainer) {
    let isShuffling = false;

    // Helper function to re-index all cards visually
    function updateDeckVisuals() {
      const cards = Array.from(deckContainer.children);
      const total = cards.length;
      
      cards.forEach((card, i) => {
        // Set proper z-index based on index in DOM
        card.style.zIndex = i;
        
        // Slightly dim background cards for depth perception
        if (i === total - 1) {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = `${0.45 + (i / total) * 0.5}`;
          card.style.pointerEvents = 'none';
        }
      });
    }

    function shuffle() {
      if (isShuffling) return;
      isShuffling = true;

      const cards = Array.from(deckContainer.children);
      if (cards.length <= 1) {
        isShuffling = false;
        return;
      }

      // The top card is the last child in the DOM
      const topCard = cards[cards.length - 1];

      // Play swipe animation
      topCard.classList.add('swiped-out');

      setTimeout(() => {
        // Remove swiped animation class
        topCard.classList.remove('swiped-out');
        
        // Move the top card to the bottom of the DOM (first child)
        deckContainer.insertBefore(topCard, deckContainer.firstChild);
        
        // Reset styles and stack positions
        updateDeckVisuals();
        
        isShuffling = false;
      }, 400); // Matches CSS transition duration
    }

    // Trigger shuffle on clicking the container or the button
    deckContainer.addEventListener('click', shuffle);
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', shuffle);
    }

    // Run initial visual indexing
    updateDeckVisuals();
  }

});
