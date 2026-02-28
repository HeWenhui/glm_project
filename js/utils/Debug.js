export default class Debug {
    static init(game) {
        console.log('Debug system initialized');
    }

    static logScene(scene) {
        console.log(`当前场景: ${scene.scene.key}`);
        console.log(`对象数量: ${scene.children.length}`);
        console.log(`物理对象: ${scene.physics.world.bodies.size}`);
    }

    static logPerformance(scene) {
        const fps = scene.game.loop.actualFps;
        console.log(`FPS: ${fps.toFixed(2)}`);
    }
}
