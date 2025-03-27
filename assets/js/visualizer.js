/**
 * visualizer.js - システムアーキテクチャ視覚化
 * 
 * D3.jsを使用してシステムアーキテクチャをインタラクティブに表示
 */

document.addEventListener('DOMContentLoaded', function() {
    // アーキテクチャ図の初期化
    initArchitectureDiagram();
});

/**
 * システムアーキテクチャ図の初期化
 */
function initArchitectureDiagram() {
    const svg = d3.select("#architecture-svg");
    
    if (svg.empty()) return;
    
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    
    // 基本的な色の設定
    const colors = {
        background: "#f8f9fa",
        node: {
            environment: "#6c757d",
            agent: "#3498db",
            icm: "#e74c3c",
            symbolic: "#2ecc71",
            policy: "#f39c12"
        },
        link: "#adb5bd"
    };
    
    // システムコンポーネントのデータ
    const nodes = [
        { id: "environment", name: "環境", x: 200, y: 50, radius: 40, color: colors.node.environment },
        { id: "agent", name: "エージェント", x: 200, y: 150, radius: 30, color: colors.node.agent },
        { id: "icm", name: "内部好奇心モジュール", x: 100, y: 230, radius: 35, color: colors.node.icm },
        { id: "symbolic", name: "記号的プランニング層", x: 300, y: 230, radius: 35, color: colors.node.symbolic },
        { id: "policy", name: "ポリシー学習", x: 200, y: 230, radius: 25, color: colors.node.policy }
    ];
    
    // コンポーネント間の接続
    const links = [
        { source: "environment", target: "agent", value: 3 },
        { source: "agent", target: "icm", value: 2 },
        { source: "agent", target: "symbolic", value: 2 },
        { source: "agent", target: "policy", value: 2 },
        { source: "icm", target: "policy", value: 1 },
        { source: "symbolic", target: "policy", value: 1 },
        { source: "symbolic", target: "icm", value: 1, dashed: true }
    ];
    
    // 背景を描画
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colors.background)
        .attr("rx", 10)
        .attr("ry", 10);
    
    // リンクを描画
    const linkElements = svg.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", colors.link)
        .attr("stroke-width", d => d.value * 2)
        .attr("stroke-dasharray", d => d.dashed ? "5,5" : "none");
    
    // ノードを描画
    const nodeElements = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.radius)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    
    // ノードのラベルを描画
    const textElements = svg.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("pointer-events", "none")
        .text(d => d.id);
    
    // 詳細情報表示用のツールチップ
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
        .style("font-size", "12px")
        .style("max-width", "250px");
    
    // マウスオーバー時の処理
    function handleMouseOver(event, d) {
        // ノードを強調表示
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d.radius * 1.2);
        
        // 詳細情報の表示
        let tooltipContent = `<strong>${d.name}</strong><br>`;
        
        switch (d.id) {
            case "environment":
                tooltipContent += "エージェントと相互作用する外部環境。<br>新規性が動的に注入され、エージェントの適応能力をテスト。";
                break;
            case "agent":
                tooltipContent += "ハイブリッドプランニングと学習システムを備えたエージェント。<br>環境との相互作用から学び、適応する。";
                break;
            case "icm":
                tooltipContent += "内部好奇心モジュール。<br>予測誤差を内部報酬として使用し、新規な状態遷移への探索を促進。";
                break;
            case "symbolic":
                tooltipContent += "記号的プランニング層。<br>環境からオペレータを抽出し、想像上の空間で計画を立案。";
                break;
            case "policy":
                tooltipContent += "ポリシー学習モジュール。<br>環境からの外部報酬と内部報酬に基づいて行動ポリシーを最適化。";
                break;
        }
        
        tooltip.html(tooltipContent)
            .style("visibility", "visible")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    }
    
    // マウスアウト時の処理
    function handleMouseOut() {
        // ノードを元のサイズに戻す
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => d.radius);
        
        // ツールチップを非表示
        tooltip.style("visibility", "hidden");
    }
    
    // アニメーション：データフロー
    function animateDataFlow() {
        // 環境からエージェントへのデータフロー
        animateFlow("environment", "agent");
        
        // エージェントから各モジュールへのデータフロー（遅延あり）
        setTimeout(() => {
            animateFlow("agent", "icm");
            animateFlow("agent", "symbolic");
            animateFlow("agent", "policy");
        }, 1000);
        
        // 各モジュール間の相互作用（さらに遅延）
        setTimeout(() => {
            animateFlow("icm", "policy");
            animateFlow("symbolic", "policy");
            animateFlow("symbolic", "icm");
        }, 2000);
    }
    
    // データフローのアニメーション
    function animateFlow(source, target) {
        const sourceNode = nodes.find(n => n.id === source);
        const targetNode = nodes.find(n => n.id === target);
        
        // 流れを表す円を作成
        const flow = svg.append("circle")
            .attr("cx", sourceNode.x)
            .attr("cy", sourceNode.y)
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("opacity", 0.7);
        
        // 出発点から目的地へアニメーション
        flow.transition()
            .duration(1000)
            .attr("cx", targetNode.x)
            .attr("cy", targetNode.y)
            .on("end", function() {
                // アニメーション終了時に要素を削除
                flow.remove();
            });
    }
    
    // 定期的にアニメーションを実行
    setInterval(animateDataFlow, 5000);
    
    // 初回アニメーション
    animateDataFlow();
}