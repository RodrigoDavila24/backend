// Shade and sun are one scale (ADR-030): a saved route weighs one of them or neither. Routes saved
// before with both keep the larger one, or neither if they are equal (they cancelled out in the cost,
// ADR-023), and a CHECK keeps it so. The log says how many routes were fixed, for the deployment.
const { logger } = require('../../utils/logger');

const CONSTRAINT = 'route_profiles_exclusive_shade_sun';

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    return sequelize.transaction(async (transaction) => {
      await sequelize.query("SET LOCAL statement_timeout = '30s'", { transaction });
      const [[{ fixed }]] = await sequelize.query(
        `
        WITH fixed AS (
          UPDATE route_profiles
          SET shade_weight = CASE WHEN shade_weight > sun_weight THEN shade_weight ELSE 0 END,
              sun_weight = CASE WHEN sun_weight > shade_weight THEN sun_weight ELSE 0 END,
              updated_at = now()
          WHERE shade_weight > 0 AND sun_weight > 0
          RETURNING id
        )
        SELECT count(*)::int AS fixed FROM fixed;
        `,
        { transaction }
      );
      await sequelize.query(
        `ALTER TABLE route_profiles ADD CONSTRAINT ${CONSTRAINT}
           CHECK (NOT (shade_weight > 0 AND sun_weight > 0));`,
        { transaction }
      );
      logger.info(
        `exclusive-shade-sun: ${fixed} route profile(s) had shade and sun at once and were fixed`
      );
      return fixed;
    });
  },

  // The fixed weights are not restored: only the constraint goes.
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE route_profiles DROP CONSTRAINT IF EXISTS ${CONSTRAINT};`
    );
  }
};
