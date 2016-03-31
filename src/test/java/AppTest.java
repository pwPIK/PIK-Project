
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Julian Rubin <rubin94@gmail.com>
 */
public class AppTest {
    
    public AppTest() {
    }

    @Test
    public void testIsEven() {
        App app = new App();
        assertEquals(true, app.isEven(4));
    }
    
}
